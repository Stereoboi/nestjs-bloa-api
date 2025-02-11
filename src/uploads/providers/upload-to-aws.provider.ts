import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();
    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('appConfig.awsBucketName'),
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    // Extract filename (without extension)
    let name = file.originalname.split('.')[0];

    // Remove whitespaces and trim
    name = name.replace(/\s/g, '').trim();

    // Extract extension
    const extension = path.extname(file.originalname);

    // Generate timestamp
    const timeStamp = Date.now(); // Коротший варіант new Date().getTime()

    // Return generated filename
    return `${name}-${timeStamp}-${uuid4()}${extension}`;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    /**Inject config service */
    private readonly configService: ConfigService,
    /**Inject upload to aws provider */
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    /**Inject upload repository */
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    //throw err for unsupported MIME types
    const condition = [
      'image/gif',
      'image/jpeg',
      'image/jpg,',
      'image/png',
    ].includes(file.mimetype);
    if (condition) throw new BadRequestException('Mime type unsupported');
    try {
      // upload file to s3
      const path = await this.uploadToAwsProvider.fileUpload(file);
      //generate entitty at DB
      const uploadFile: UploadFile = {
        name: path,
        path: `${this.configService.get<string>('appConfig.awsCloudfrontUrl')}/${path}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}

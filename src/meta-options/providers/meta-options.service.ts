import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Metaoptions } from '../meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    /**
     * Inject metaoptions repository
     */
    @InjectRepository(Metaoptions)
    private readonly metaOptionsRepository: Repository<Metaoptions>,
  ) {}
  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    const metaoption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionsRepository.save(metaoption);
  }
}

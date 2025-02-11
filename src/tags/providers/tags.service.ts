import { Body, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatetagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    /**Inject Tags Repository */
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async create(@Body() createTagDto: CreatetagDto) {
    const tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }

  public async findMultipletags(tags: number[]) {
    const results = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });
    return results;
  }
  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return { deleted: true, id };
  }

  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);
    return { deleted: true, id };
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    /**
     * Inject metaobject service
     */
    private readonly metaoptionsService: MetaOptionsService,
  ) {}
  @Post()
  public create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    return this.metaoptionsService.create(createPostMetaOptionsDto);
  }
}

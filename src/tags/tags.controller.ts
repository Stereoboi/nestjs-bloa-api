import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreatetagDto } from './dtos/create-tag.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Creates a new blog tags',
  })
  @ApiResponse({
    status: 201,
    description: 'You have 201 response if post created successfylly',
  })
  @Post()
  public create(@Body() createTagsDto: CreatetagDto) {
    return this.tagsService.create(createTagsDto);
  }

  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  @Delete('soft-delete')
  public async softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softRemove(id);
  }
}

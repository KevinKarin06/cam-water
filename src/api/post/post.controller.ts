import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { apiResponse } from 'src/utils/constants';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { postFileValidator } from 'src/utils/helpers';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('images', 5))
  async createPost(
    @Body() data: CreatePostDto,
    @Res() res: any,
    @UploadedFiles(postFileValidator())
    files: Array<Express.Multer.File>,
  ) {
    const response = await this.postService.createPost(data, files);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(201).send(response);
    }
  }

  @Post(':id')
  @UseInterceptors(FilesInterceptor('images', 5))
  async updatePost(
    @Body() data: UpdatePostDto,
    @Res() res: any,
    @Param('id') id: any,
    @UploadedFiles(postFileValidator())
    files: Array<Express.Multer.File>,
  ) {
    const response = await this.postService.updatePost(data, files, +id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(201).send(response);
    }
  }

  @Get('')
  async getPosts(@Res() res: any, @Query() query: any) {
    const response = await this.postService.getPosts(query);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }

  @Get(':id/similar')
  async getSimilarPosts(@Res() res: any, @Param('id') id: string) {
    const response = await this.postService.getSimilarPost(+id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }

  @Get(':id')
  async getPost(@Res() res: any, @Param('id') id: string) {
    const response = await this.postService.getPost(+id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { ApiResponse } from '../types/api-response';
import { apiResponse } from 'src/utils/constants';
import {
  generatePublicUrl,
  generateFilePath,
  setErrorResponse,
  writeFile,
} from 'src/utils/helpers';
import { CustomLogger } from 'src/utils/logger';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  private logger: CustomLogger = new CustomLogger('PostService');
  constructor(private prismaService: PrismaService) {}

  async createPost(
    data: CreatePostDto,
    images: Array<Express.Multer.File>,
  ): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
    };

    const postImages = [];
    try {
      if (images) {
        for (const file of images) {
          const filePath = generateFilePath(file.originalname, data.deviceId);
          writeFile(filePath, file.buffer, false);
          const publicUrl = generatePublicUrl(filePath);
          postImages.push(publicUrl);
        }
      }

      response.data = await this.prismaService.post.create({
        data: {
          images: postImages,
          latitude: data.latitude,
          longitude: data.longitude,
          priority: data.priority,
          description: data.description,
          deviceId: data.deviceId,
        },
      });
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async updatePost(
    data: UpdatePostDto,
    images: Array<Express.Multer.File>,
    id: number,
  ): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
    };

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      setErrorResponse(response, 'Post not found', 404);
      return response;
    }

    //validate teamId if present

    const postImages = [];
    try {
      if (images) {
        for (const file of images) {
          const filePath = generateFilePath(file.originalname, post.deviceId);
          writeFile(filePath, file.buffer, false);
          const publicUrl = generatePublicUrl(filePath);
          postImages.push(publicUrl);
        }
      }

      const uniquImages = new Set([...postImages, ...(post.images as any)]);

      response.data = await this.prismaService.post.update({
        where: { id: post.id },
        data: {
          images: [...uniquImages],
          status: data.status,
          teamId: +data.teamId,
        },
      });
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getPost(id: number): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id,
        },
      });

      if (!post) {
        setErrorResponse(response, 'Post not found', 404);
        return response;
      }

      response.data = post;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getSimilarPost(id: number): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const post = await this.prismaService.post.findUnique({
        where: {
          id,
        },
      });

      if (!post) {
        setErrorResponse(response, 'Post not found', 404);
        return response;
      }

      const similarPosts = await this.prismaService.$queryRaw`
      SELECT *
      FROM Post
      WHERE ST_Distance_Sphere(
        point(latitude, longitude),
        point(${post.latitude}, ${post.longitude})
      ) <= ${100}
      AND id != ${post.id};
    `;

      post['similar'] = similarPosts;

      response.data = post;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getPosts(params: any): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const posts = await this.prismaService.post.findMany({
        where: {
          ...(params.deviceId ? { deviceId: params.deviceId } : {}),
        },
        skip: params.page ? (params.page - 1) * params.pageSize || 100 : 0,
        take: params.pageSize ? +params.pageSize : 100,
      });

      response.data = posts;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }
}

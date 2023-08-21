import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/utils/constants';
import { setErrorResponse } from 'src/utils/helpers';
import { CustomLogger } from 'src/utils/logger';
import { ApiResponse } from '../types/api-response';

@Injectable()
export class UserService {
  private logger: CustomLogger = new CustomLogger('UserService');
  constructor(private prismaService: PrismaService) {}

  async getUser(id: number): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        setErrorResponse(response, 'User not found', 404);
        return response;
      }

      response.data = user;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getUsers(params: any): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const users = await this.prismaService.user.findMany({
        skip: params.page ? (params.page - 1) * params.pageSize || 100 : 0,
        take: params.pageSize ? +params.pageSize : 100,
      });

      response.data = users;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }
}

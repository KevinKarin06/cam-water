import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { apiResponse } from 'src/utils/constants';
import { setErrorResponse } from 'src/utils/helpers';
import { CustomLogger } from 'src/utils/logger';
import { ApiResponse } from '../types/api-response';

@Injectable()
export class TeamsService {
  private logger: CustomLogger = new CustomLogger('TeamsService');
  constructor(private prismaService: PrismaService) {}

  async getTeam(id: number): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const team = await this.prismaService.team.findUnique({
        include: { employeesOnTeams: { select: { employee: true } } },
        where: {
          id,
        },
      });

      if (!team) {
        setErrorResponse(response, 'Team not found', 404);
        return response;
      }

      response.data = team;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getTeams(params: any): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const teams = await this.prismaService.team.findMany({
        include: { employeesOnTeams: { select: { employee: true } } },
        skip: params.page ? (params.page - 1) * params.pageSize || 100 : 0,
        take: params.pageSize ? +params.pageSize : 100,
      });

      response.data = teams;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }
}

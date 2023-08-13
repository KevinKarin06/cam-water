import { Injectable } from '@nestjs/common';
import { apiResponse } from 'src/utils/constants';
import { setErrorResponse } from 'src/utils/helpers';
import { ApiResponse } from '../types/api-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomLogger } from 'src/utils/logger';

@Injectable()
export class EmployeeService {
  private logger: CustomLogger = new CustomLogger('EmployeeService');
  constructor(private prismaService: PrismaService) {}

  async getEmployee(id: number): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const employee = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!employee) {
        setErrorResponse(response, 'Employee not found', 404);
        return response;
      }

      response.data = employee;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }

  async getEmployees(params: any): Promise<ApiResponse> {
    const response: ApiResponse = {
      data: null,
      message: apiResponse.message,
      code: apiResponse.codes.OK,
      statusCode: 200,
    };

    try {
      const employees = await this.prismaService.employee.findMany({
        skip: params.page ? (params.page - 1) * params.pageSize || 100 : 0,
        take: params.pageSize ? +params.pageSize : 100,
      });

      response.data = employees;
    } catch (error) {
      setErrorResponse(response);
      this.logger.error(error);
    }

    return response;
  }
}

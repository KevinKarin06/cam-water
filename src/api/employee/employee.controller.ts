import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { apiResponse } from 'src/utils/constants';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get(':id')
  async getEmployee(@Res() res: any, @Param('id') id: string) {
    const response = await this.employeeService.getEmployee(+id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }

  @Get('')
  async getEmployees(@Res() res: any, @Query() query: any) {
    const response = await this.employeeService.getEmployees(query);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }
}

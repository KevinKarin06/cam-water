import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { apiResponse } from 'src/utils/constants';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(@Res() res: any, @Param('id') id: string) {
    const response = await this.userService.getUser(+id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }

  @Get('')
  async getUsers(@Res() res: any, @Query() query: any) {
    const response = await this.userService.getUsers(query);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }
}

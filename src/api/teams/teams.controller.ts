import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { apiResponse } from 'src/utils/constants';

@Controller('teams')
export class TeamsController {
  constructor(private teamService: TeamsService) {}

  @Get(':id')
  async getTeam(@Res() res: any, @Param('id') id: string) {
    const response = await this.teamService.getTeam(+id);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }

  @Get('')
  async getTeams(@Res() res: any, @Query() query: any) {
    const response = await this.teamService.getTeams(query);

    if (response.code != apiResponse.codes.OK) {
      return res.status(response.statusCode).send(response);
    } else {
      return res.status(200).send(response);
    }
  }
}

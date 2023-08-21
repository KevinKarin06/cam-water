import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { employees, teamMembers, teams, users } from './utils/constants';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  index(): object {
    return { message: 'App is running........' };
  }

  async onModuleInit(): Promise<void> {
    await this.initDemoData();
  }

  private async initDemoData() {
    try {
      for (const user of users) {
        const t = await this.prismaService.user.findFirst({
          where: { name: user.name },
        });

        if (!t) {
          await this.prismaService.user.create({
            data: {
              name: user.name,
              phone: user.phone,
              deviceId: user.deviceId,
            },
          });
        }
      }

      for (const team of teams) {
        const t = await this.prismaService.team.findFirst({
          where: { name: team.name },
        });

        if (!t) {
          await this.prismaService.team.create({
            data: {
              name: team.name,
              archive: team.archive,
            },
          });
        }
      }

      for (const employee of employees) {
        const t = await this.prismaService.employee.findFirst({
          where: { name: employee.name },
        });

        if (!t) {
          await this.prismaService.employee.create({
            data: {
              name: employee.name,
              phone: employee.phone,
            },
          });
        }
      }

      for (const tM of teamMembers) {
        const t = await this.prismaService.employeesOnTeams.findUnique({
          where: {
            teamId_employeeId: { employeeId: tM.employeeId, teamId: tM.teamId },
          },
        });

        if (!t) {
          await this.prismaService.employeesOnTeams.create({
            data: {
              teamId: tM.teamId,
              employeeId: tM.employeeId,
            },
          });
        }
      }
    } catch (error) {
      console.log('failed to initialize demo data');
    }
  }
}

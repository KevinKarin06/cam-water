import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HttpRequestLoggerMiddleware } from './middlewares/http-request.middleware';
import { TeamsModule } from './api/teams/teams.module';
import { EmployeeModule } from './api/employee/employee.module';
import { PostModule } from './api/post/post.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [
    PrismaModule,
    TeamsModule,
    EmployeeModule,
    PostModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpRequestLoggerMiddleware).forRoutes('*');
  }
}

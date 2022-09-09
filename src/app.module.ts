import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import envConfig from './config.env';

@Module({
  imports: [
    TypeOrmModule.forRoot(envConfig.orm),
    TypeOrmModule.forFeature([
      // 导入的entity

    ]),
    UserModule
  ],
  // 导入的controller
  controllers: [AppController],
  // 导入的serveice
  providers: [AppService],
})
export class AppModule {}

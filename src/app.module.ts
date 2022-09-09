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

    ]),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

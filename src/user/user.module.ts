import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserToken } from './user-token.entity';
import { HttpStrategy } from './http.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    PassportModule.register({ defaultStrategy: 'bearer' })
  ],
  controllers: [UserController],
  providers: [
    UserService,
    HttpStrategy
  ],
  exports: [UserService],
})
export class UserModule {}

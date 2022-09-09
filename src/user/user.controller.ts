import {Controller, Get, Post, Body, UseGuards, Req, Param, Query, BadRequestException} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('login')
  login(@Body('phone') phone: string, @Body('password') password: string) {
    return this.userService.login(phone, password);
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('openToken')
  @UseGuards(AuthGuard())
  async getOpenToken(@Req() req: any) {
    return !!(await this.userService.getOpenToken(req.user.id));
  }

  @Post('openToken')
  @UseGuards(AuthGuard())
  async generateOpenToken(@Req() req: any) {
    const token = await this.userService.generateOpenToken(req.user.id);
    return token.token;
  }

  @Get(':userId')
  @UseGuards(AuthGuard())
  async getOneUser(
      @Param('userId') userId: number,
  ) {
      return this.userService.getUser(userId);
  }

  @Get('')
  @UseGuards(AuthGuard())
  async getUsers(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.getUserProfiles({ page, pageSize });
  }

  @Post('register')
  register(
    @Body('phone') phone: string,
    @Body('name') name: string,
    @Body('password') password: string
  ) {
    console.log(111);
    
    if (!phone || !name || !password) {
      console.log(2222);
      
      throw new BadRequestException();
    }
    return this.userService.createUser(phone, name, password);
  }
}

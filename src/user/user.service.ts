import { Injectable, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import * as moment from 'moment';
import * as _ from 'lodash';
import { User } from './user.entity';
import { Repository, MoreThanOrEqual, Like, In } from 'typeorm';
import { UserToken } from './user-token.entity';
import { sha256 } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>
  ) {}
  async createUserToken(userId: number) {
    return this.userTokenRepository.save({
      userId: userId,
      token: nanoid(),
      createdAt: new Date(),
      expiredAt: moment().add(7, 'day').toDate(),
    });
  }
  async login(phone: string, password: string) {
    if (!phone || !password) {
      throw new ForbiddenException();
    }
    const user = await this.userRepository.findOne({
      where: { phone, password: sha256(password) },
    });
    
    if (!user) {
      throw new ForbiddenException();
    }
    if (user.banned) {
      throw new ForbiddenException('账号已停用，请联系客服');
    }
    const token = await this.createUserToken(user.id);
    return { token: token.token };
  }
  async validateUser(token: string) {
    const userToken = await this.userTokenRepository.findOne({ where: [
      { token, isOpen: false, expiredAt: MoreThanOrEqual(new Date()) },
      { token, isOpen: true },
    ] });
    console.log(userToken);
    
    if (!userToken || !userToken.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOne({ where: { id: userToken.userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.expireAt && moment(user.expireAt).isBefore(moment())) {
      throw new UnauthorizedException('试用已到期');
    }
    const roles: string[] = [];
    if (user.roleAdmin) {
      roles.push('admin');
    }
    if (userToken.isOpen) {
      roles.push('open');
    }
    return {
      ..._.omit(user, 'password'),
      roles,
    };
  }
  async getUsers({ page, pageSize, name }: { page: number, pageSize: number, name?: string }) {
    const wheres = {};
    if (name) {
      wheres['name'] = Like(`%${name}%`);
    }
    return this.userRepository.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: wheres
    });
  }
  async getUserProfiles({ page, pageSize }) {
    return this.userRepository.findAndCount({
      select:['id', 'name', 'phone', 'createdAt'],
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: { banned: false }
    });
  }
  async getUser(userId: number) {
    if (!userId) {
      throw new Error('getUser需要userId，接收到：' + userId)
    }
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async clearUserToken(userId: number) {
    const tokens = await this.userTokenRepository.find({
      where: { userId, expiredAt: MoreThanOrEqual(new Date()) },
    });
    for (const token of tokens) {
      await this.userTokenRepository.update(token.id, { expiredAt: new Date() });
    }
  }

  async createUser(phone: string, name: string, password: string) {
    console.log(phone, name, sha256(password));
    
    return this.userRepository.save({
      phone,
      name,
      password,

    })
  }
  async getOpenToken(userId: number) {
    return this.userTokenRepository.findOne({ where: { userId, isOpen: true } });
  }
  async generateOpenToken(userId: number) {
    await this.userTokenRepository.delete({ userId, isOpen: true });
    return this.userTokenRepository.save({
      userId,
      token: nanoid(),
      createdAt: new Date(),
      isOpen: true,
    });
  }

  async getUsersById(id: number, size: number) {
    return this.userRepository.find({
      select: ['id', 'name'],
      where: { id: MoreThanOrEqual(id) },
      take: size
    });
  }
  async getUsersByIds(ids: number[]) {
    return this.userRepository.find({ where: { id: In(ids) } });
  }

  async changeUnexposedDays(id: number, unexposedDays: number) {
    return this.userRepository.save({
      id,
      unexposedDays
    });
  }
}

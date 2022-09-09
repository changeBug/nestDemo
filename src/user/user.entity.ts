import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, default: '' })
  name: string;

  @Column({ length: 16 })
  phone: string;

  @Column({ length: 64 })
  password: string;

  @Column({ default: false })
  roleAdmin: boolean;

  @Column({ default: false })
  banned: boolean;

  @Column('datetime')
  createdAt: Date;

  @Column({ type: 'datetime' })
  expireAt: Date;
}

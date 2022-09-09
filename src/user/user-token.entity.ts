import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('userId', { unique: false })
  @Column({ default: 0 })
  userId: number;

  @Column({ length: 32 })
  token: string;

  @Column({ default: false })
  isOpen: boolean;

  @Column('datetime')
  createdAt: Date;

  @Column('datetime')
  expiredAt: Date;
}

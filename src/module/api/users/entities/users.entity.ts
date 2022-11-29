import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    name: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    unique: true,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    select: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    name: 'isVerify',
    default: false,
  })
  isVerify: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}

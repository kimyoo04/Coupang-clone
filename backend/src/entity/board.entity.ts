import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne, // Many-to-One 관계를 위해 추가
  JoinColumn, // 외래키를 위해 추가
} from 'typeorm';
import { User } from './user.entity'; // User 엔티티를 import
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'board' })
export class Board {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ description: '제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column()
  content: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.boards) // Many-to-One 관계 설정
  @JoinColumn({ name: 'user_id' }) // 외래키를 'user_id' 컬럼에 지정
  user: User; // User 엔티티와의 관계를 나타내는 필드
}

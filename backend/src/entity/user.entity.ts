import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { Board } from './board.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email']) // 이메일은 중복되지 않아야 합니다.
export class User {
  // @PrimaryColumn('uuid', { default: uuidv4() }) // 기본값으로 UUID를 생성
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ description: '이름' })
  @Column()
  name: string;

  @ApiProperty({ description: '이메일' })
  @Column()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @Column()
  password: string;

  @ApiProperty({ description: '이메일 인증 여부' })
  @Column({ default: false })
  emailVerified: boolean;

  @ApiProperty({ description: '이메일 인증 토큰' })
  @Column({ nullable: true })
  oauthProvider: string; // OAuth 제공자 (ex: Google, Facebook 등)

  @ApiProperty({ description: 'Oauth 아이디' })
  @Column({ nullable: true })
  oauthId: string; // OAuth 제공자에서의 사용자 고유 ID

  @ApiProperty({ description: '프로필 사진 URL' })
  @Column({ nullable: true })
  profilePictureUrl: string; // OAuth 제공자에서 받아온 프로필 사진 URL

  // Board와의 One-to-Many 관계 설정
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[]; // User 엔티티와의 관계를 나타내는 필드
}

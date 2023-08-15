import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '@/entity/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  exports: [BoardService],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}

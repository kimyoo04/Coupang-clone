import { Injectable } from '@nestjs/common';
import { Board } from '@/entity/board.entity';
import { CreateBoardReqDto, UpdateBoardReqDto } from './dto/req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  private boards = [
    {
      id: '1',
      title: 'title1',
      content: 'content1',
    },
    {
      id: '2',
      title: 'title2',
      content: 'content2',
    },
    {
      id: '3',
      title: 'title3',
      content: 'content3',
    },
  ];

  findAll() {
    return this.boards;
  }

  find(id: string) {
    const board = this.getOneBoard(id);

    if (!board) return 'not found';
    return board;
  }

  create(body: CreateBoardReqDto) {
    const newBoard = {
      id: this.getNextId(),
      ...body,
    };
    this.boards.push(newBoard);
    return newBoard;
  }

  update(id: string, body: UpdateBoardReqDto) {
    const index = this.getBoardIndex(id);

    if (index === -1) return 'not found';

    this.boards[index] = {
      ...this.boards[index],
      ...body,
    };

    return this.boards[index];
  }

  remove(id: string) {
    const index = this.getBoardIndex(id);

    if (index === -1) return 'not found';
    else this.boards.splice(index, 1);

    return `remove board - ${id}`;
  }

  // 다음 id 구하기
  getNextId() {
    return String(this.boards.length + 1);
  }

  // id로 게시글 인덱스 찾기
  getBoardIndex(id: string) {
    return this.boards.findIndex((board) => board.id === id);
  }

  // id로 게시글 찾기
  getOneBoard(id: string) {
    return this.boards.find((board) => board.id === id);
  }
}

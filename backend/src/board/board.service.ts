import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  private boards = [
    {
      id: 1,
      title: 'title1',
      content: 'content1',
    },
    {
      id: 2,
      title: 'title2',
      content: 'content2',
    },
    {
      id: 3,
      title: 'title3',
      content: 'content3',
    },
  ];

  findAll() {
    return this.boards;
  }

  find(id: number) {
    const board = this.getOneBoard(id);

    if (!board) return 'not found';
    return board;
  }

  create(body: CreateBoardDto) {
    const newBoard = {
      id: this.getNextId(),
      ...body,
    };
    this.boards.push(newBoard);
    return newBoard;
  }

  update(id: number, body: UpdateBoardDto) {
    const index = this.getBoardIndex(id);

    if (index === -1) return 'not found';

    this.boards[index] = {
      ...this.boards[index],
      ...body,
    };

    return this.boards[index];
  }

  remove(id: number) {
    const index = this.getBoardIndex(id);

    if (index === -1) return 'not found';
    else this.boards.splice(index, 1);

    return `remove board - ${id}`;
  }

  // 다음 id 구하기
  getNextId() {
    return this.boards.length + 1;
  }

  // id로 게시글 인덱스 찾기
  getBoardIndex(id: number) {
    return this.boards.findIndex((board) => board.id === id);
  }

  // id로 게시글 찾기
  getOneBoard(id: number) {
    return this.boards.find((board) => board.id === id);
  }
}

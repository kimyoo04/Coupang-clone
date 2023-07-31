import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  findAll() {
    return 'find All';
  }

  find(id: number) {
    return `find ${id}`;
  }

  create(body: any) {
    console.log(body);
    return 'create';
  }

  update(id: number, body: any) {
    console.log(id, body);
    return 'update';
  }

  remove(id: number) {
    return `remove ${id}`;
  }
}

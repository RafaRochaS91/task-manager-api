import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.type';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    try {
      const newTask = await this.insert({ title, description, status: 'OPEN' });

      return newTask.raw;
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  async deleteTask(id: number) {
    try {
      const result = await this.delete(id);
      return result.affected;
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    try {
      const result = await this.update({ id }, { status });

      return result.affected;
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }
}

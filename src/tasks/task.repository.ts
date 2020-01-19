import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.type';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    const { status, searchTerm } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (searchTerm) {
      query.andWhere(
        'task.title LIKE :searchTerm OR task.description LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    const tasks = query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    try {
      const newTask = await this.insert({ title, description, status: 'OPEN', user });

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

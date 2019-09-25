import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.type';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto) {
    const { status, searchTerm } = filterDto;
    const query = this.createQueryBuilder('task');

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
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User) {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, userId: user.id });

    if (!found) {
      throw new NotFoundException(`Task with id: ${id} was not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User) {
    await this.taskRepository.findOne({ id, userId: user.id });

    return this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User) {
    await this.getTaskById(id, user);

    return this.taskRepository.updateTaskStatus(id, status);
  }
}

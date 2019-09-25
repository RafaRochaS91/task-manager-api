import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TaskStatus } from './task-status.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id: ${id} was not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number) {
    await this.taskRepository.findOne(id);

    return this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    await this.getTaskById(id);

    return this.taskRepository.updateTaskStatus(id, status);
  }
}

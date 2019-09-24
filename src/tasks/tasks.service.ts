import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, searchTerm } = filterDto;

    let filteredTasks = [];

    if (status) {
      filteredTasks = this.tasks.filter(task => task.status === status);
    }

    if (searchTerm) {
      filteredTasks = this.tasks.filter(
        task =>
          task.description.includes(searchTerm) ||
          task.title.includes(searchTerm),
      );
    }

    return filteredTasks;
  }

  getTaskById(id: string) {
    return this.tasks.find(task => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: 'OPEN',
    };

    this.tasks = [...this.tasks, task];

    return task;
  }

  deleteTask(id: string) {
    const deletedTask = this.tasks.filter(task => task.id === id);
    this.tasks = this.tasks.filter(task => task.id !== id);

    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const taskToUpdate = this.getTaskById(id);
    const updatedTask = { ...taskToUpdate, status };

    const updatedTasks = this.tasks.map(task => {
      if (task.id === id) {
        return updatedTask;
      }
      return task;
    });

    this.tasks = updatedTasks;

    return updatedTask;
  }
}

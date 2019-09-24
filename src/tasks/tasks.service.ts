import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from 'dist/tasks/tasks.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string) {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: 'Open',
    }

    this.tasks = [ ...this.tasks, task ];

    return task;
  }

  deleteTask(id: string) {
    const deletedTask = this.tasks.filter((task) => task.id === id);
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const taskToUpdate = this.getTaskById(id);
    const updatedTask = { ...taskToUpdate, status };

    const updatedTasks = this.tasks.map((task) => {
      if (task.id === id) {
        return updatedTask;
      }
      return task;
    });

    this.tasks = updatedTasks;

    return updatedTask;
  }
}

import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';

@Controller('/tasks')
export class TasksController {
  @Get()
  getAllTasks() {
    return {};
  }

  @Post()
  createTask() {
    return true;
  }

  @Delete()
  deleteTask(taskId: string) {
    return true;
  }

  @Patch()
  updateTask(taskId: string, content: {}) {

  }
}

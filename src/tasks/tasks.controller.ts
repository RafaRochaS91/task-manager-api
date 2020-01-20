import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValitationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<number> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValitationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.taskService.updateTaskStatus(id, status, user);
  }
}

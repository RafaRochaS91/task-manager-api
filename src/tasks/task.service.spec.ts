import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.type';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  username: 'Test user',
  id: 12,
}

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it ('gets all tasks from the repository', () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, searchTerm: 'Some search query' }

      // call tasksService.getTasks
      tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it ('calls the taskRespository.findOne() and successfully retrieve and return a task', async () => {
      const mockTask = { title: 'Test Task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
    });

    it ('throws an error if no task is found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls the taskRepository.insert()', async () => {
      const mockTask = { title: 'Test Task', description: 'Test desc' };
      taskRepository.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask(mockTask);
      expect(result).toEqual(mockTask);
    });
  })
});

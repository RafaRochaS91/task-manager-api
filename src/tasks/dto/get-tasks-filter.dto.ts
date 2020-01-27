import { TaskStatus } from '../task-status.type';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
}

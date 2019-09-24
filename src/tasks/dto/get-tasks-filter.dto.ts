import { TaskStatus } from '../tasks.model';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {
  readonly allowedStatus: TaskStatus[] = [
    'OPEN',
    'IN PROGRESS',
    'DONE',
  ]

  @IsOptional()
  @IsIn(this.allowedStatus)
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  searchTerm: string;
}

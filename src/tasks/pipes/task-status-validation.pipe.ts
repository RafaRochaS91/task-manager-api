import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../tasks.model';

export class TaskStatusValitationPipe implements PipeTransform {
  readonly allowedStatuses: TaskStatus[] = [
    'OPEN',
    'IN PROGRESS',
    'DONE',
  ]

  transform(value: string) {
    const transformedValue = value.toUpperCase();

    if(!this.isStatusValid(transformedValue)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status) {
    return this.allowedStatuses.includes(status);
  }
}

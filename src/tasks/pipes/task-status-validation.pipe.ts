import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.type';

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

    return transformedValue;
  }

  private isStatusValid(status) {
    return this.allowedStatuses.includes(status);
  }
}

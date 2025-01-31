import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITaskConfig } from '../task-config.model';
import { TaskType } from '../../enumerations/task-type.model';
import { FormsModule } from '@angular/forms';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';

@Component({
  selector: 'jhi-task-config-detail',
  templateUrl: './task-config-detail.component.html',
  imports: [SharedModule, RouterModule, FormsModule, ReadableEnumPipe],
})
export class TaskConfigDetailComponent {
  taskConfig = input<ITaskConfig | null>(null);

  protected readonly TaskType = TaskType;

  previousState(): void {
    window.history.back();
  }
}

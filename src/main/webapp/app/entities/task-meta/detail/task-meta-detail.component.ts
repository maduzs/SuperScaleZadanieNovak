import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITaskMeta } from '../task-meta.model';
import { TaskConfigByIdPipe } from '../../../shared/common/task-config-by-id.pipe';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';
import { TaskType } from '../../enumerations/task-type.model';

@Component({
  selector: 'jhi-task-meta-detail',
  templateUrl: './task-meta-detail.component.html',
  imports: [SharedModule, RouterModule, TaskConfigByIdPipe, ReadableEnumPipe],
})
export class TaskMetaDetailComponent {
  taskMeta = input<ITaskMeta | null>(null);

  protected readonly TaskType = TaskType;

  previousState(): void {
    window.history.back();
  }
}

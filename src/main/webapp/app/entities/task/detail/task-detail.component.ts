import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ITask } from '../task.model';
import { TaskType } from '../../enumerations/task-type.model';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';
import { TaskMetaService } from '../../task-meta/service/task-meta.service';
import { TaskConfigService } from '../../task-config/service/task-config.service';
import { Subject, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITaskMeta } from '../../task-meta/task-meta.model';

@Component({
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.component.html',
  imports: [SharedModule, RouterModule, ReadableEnumPipe],
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  task = input<ITask | null>(null);

  metaConfig: ITaskMeta[] | undefined;

  protected readonly TaskType = TaskType;

  private configService = inject(TaskConfigService);
  private metaService = inject(TaskMetaService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.task()?.type) {
      this.configService
        .getConfigsByType(this.task()!.type!)
        .pipe(
          switchMap(configs => this.metaService.getFieldMetaByTaskConfig(configs)),
          takeUntil(this.destroy$),
        )
        .subscribe(value => {
          this.metaConfig = value;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  previousState(): void {
    window.history.back();
  }
}

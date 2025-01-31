import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITaskConfig } from 'app/entities/task-config/task-config.model';
import { TaskConfigService } from 'app/entities/task-config/service/task-config.service';
import { TaskFieldType } from 'app/entities/enumerations/task-field-type.model';
import { TaskMetaService } from '../service/task-meta.service';
import { ITaskMeta } from '../task-meta.model';
import { TaskMetaFormGroup, TaskMetaFormService } from './task-meta-form.service';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';
import { TaskConfigByIdPipe } from '../../../shared/common/task-config-by-id.pipe';
import { TaskType } from '../../enumerations/task-type.model';

@Component({
  selector: 'jhi-task-meta-update',
  templateUrl: './task-meta-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ReadableEnumPipe, TaskConfigByIdPipe],
})
export class TaskMetaUpdateComponent implements OnInit {
  isSaving = false;
  taskMeta: ITaskMeta | null = null;
  taskFieldTypeValues = Object.keys(TaskFieldType);

  taskConfigsSharedCollection: ITaskConfig[] = [];

  protected taskMetaService = inject(TaskMetaService);
  protected taskMetaFormService = inject(TaskMetaFormService);
  protected taskConfigService = inject(TaskConfigService);
  protected activatedRoute = inject(ActivatedRoute);
  protected readonly TaskType = TaskType;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskMetaFormGroup = this.taskMetaFormService.createTaskMetaFormGroup();

  compareTaskConfig = (o1: ITaskConfig | null, o2: ITaskConfig | null): boolean => this.taskConfigService.compareTaskConfig(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taskMeta }) => {
      this.taskMeta = taskMeta;
      if (taskMeta) {
        this.updateForm(taskMeta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taskMeta = this.taskMetaFormService.getTaskMeta(this.editForm);
    if (taskMeta.id !== null) {
      this.subscribeToSaveResponse(this.taskMetaService.update(taskMeta));
    } else {
      this.subscribeToSaveResponse(this.taskMetaService.create(taskMeta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskMeta>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(taskMeta: ITaskMeta): void {
    this.taskMeta = taskMeta;
    this.taskMetaFormService.resetForm(this.editForm, taskMeta);

    this.taskConfigsSharedCollection = this.taskConfigService.addTaskConfigToCollectionIfMissing<ITaskConfig>(
      this.taskConfigsSharedCollection,
      taskMeta.taskConfig,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.taskConfigService
      .query()
      .pipe(map((res: HttpResponse<ITaskConfig[]>) => res.body ?? []))
      .pipe(
        map((taskConfigs: ITaskConfig[]) =>
          this.taskConfigService.addTaskConfigToCollectionIfMissing<ITaskConfig>(taskConfigs, this.taskMeta?.taskConfig),
        ),
      )
      .subscribe((taskConfigs: ITaskConfig[]) => (this.taskConfigsSharedCollection = taskConfigs));
  }
}

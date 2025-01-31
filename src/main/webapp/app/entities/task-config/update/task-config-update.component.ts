import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from 'app/entities/enumerations/task-type.model';
import { ITaskConfig } from '../task-config.model';
import { TaskConfigService } from '../service/task-config.service';
import { TaskConfigFormGroup, TaskConfigFormService } from './task-config-form.service';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';

@Component({
  selector: 'jhi-task-config-update',
  templateUrl: './task-config-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ReadableEnumPipe],
})
export class TaskConfigUpdateComponent implements OnInit {
  isSaving = false;
  taskConfig: ITaskConfig | null = null;
  taskTypeValues = Object.keys(TaskType);

  protected taskConfigService = inject(TaskConfigService);
  protected taskConfigFormService = inject(TaskConfigFormService);
  protected activatedRoute = inject(ActivatedRoute);
  protected readonly TaskType = TaskType;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskConfigFormGroup = this.taskConfigFormService.createTaskConfigFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taskConfig }) => {
      this.taskConfig = taskConfig;
      if (taskConfig) {
        this.updateForm(taskConfig);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taskConfig = this.taskConfigFormService.getTaskConfig(this.editForm);
    if (taskConfig.id !== null) {
      this.subscribeToSaveResponse(this.taskConfigService.update(taskConfig));
    } else {
      this.subscribeToSaveResponse(this.taskConfigService.create(taskConfig));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskConfig>>): void {
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

  protected updateForm(taskConfig: ITaskConfig): void {
    this.taskConfig = taskConfig;
    this.taskConfigFormService.resetForm(this.editForm, taskConfig);
  }
}

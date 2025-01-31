import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from 'app/entities/enumerations/task-type.model';
import { ITask, ITaskDto, NewTask } from '../task.model';
import { TaskService } from '../service/task.service';
import { TaskFormGroup, TaskFormService } from './task-form.service';
import { ReadableEnumPipe } from '../../../shared/enum/readableEnum.pipe';
import { ITaskMeta } from '../../task-meta/task-meta.model';
import { TaskConfigService } from '../../task-config/service/task-config.service';
import { TaskMetaService } from '../../task-meta/service/task-meta.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, ReadableEnumPipe],
})
export class TaskUpdateComponent implements OnInit, OnDestroy {
  isSaving = false;
  task: ITask | NewTask | null = null;
  taskTypeValues = Object.keys(TaskType);

  metaConfig: ITaskMeta[] | undefined;
  fieldsGroupName = 'fields';

  protected taskService = inject(TaskService);
  protected taskFormService = inject(TaskFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  protected readonly TaskType = TaskType;

  private configService = inject(TaskConfigService);
  private metaService = inject(TaskMetaService);
  private fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        tap(data => {
          if (data.task) {
            this.task = data.task;
          } else {
            this.task = { fields: {} } as NewTask;
            this.setupFormTypeListener();
          }
        }),
        switchMap(_ => this.setupForm()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskDto>>): void {
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

  protected updateForm(task: ITask | NewTask): void {
    this.task = task;
    this.editForm = this.taskFormService.createTaskFormGroup();
    this.taskFormService.resetForm(this.editForm, task);
    if (this.task.fields && this.metaConfig?.length) {
      this.editForm.addControl(this.fieldsGroupName, this.fb.group({}));

      this.metaConfig.forEach(mf => {
        if (mf.name) {
          const group = this.editForm.get(this.fieldsGroupName) as FormGroup;
          switch (mf.type) {
            case 'STRING': {
              group.addControl(mf.name, new FormControl<string>(this.task?.fields[mf.name]));
              break;
            }
            case 'NUMBER': {
              group.addControl(mf.name, new FormControl<number>(this.task?.fields[mf.name]));
              break;
            }
            case 'DATE': {
              group.addControl(mf.name, new FormControl<string>(this.task?.fields[mf.name]));
              break;
            }
            default: {
              group.addControl(mf.name, new FormControl<string>(''));
            }
          }
        }
      });
    }
    this.setupFormTypeListener();
  }

  private setupForm(): Observable<ITaskMeta[]> {
    return of({}).pipe(
      filter(_ => !!this.task?.type),
      switchMap(_ =>
        this.configService.getConfigsByType(this.task!.type!).pipe(
          switchMap(configs => this.metaService.getFieldMetaByTaskConfig(configs)),
          tap(value => (this.metaConfig = value)),
        ),
      ),
      tap(_ => {
        if (this.task != null) {
          this.updateForm(this.task);
        }
      }),
      takeUntil(this.destroy$),
    );
  }

  private setupFormTypeListener(): void {
    this.editForm
      .get('type')
      ?.valueChanges.pipe(
        filter(type => !!type),
        tap((type: keyof typeof TaskType) => {
          if (this.task != null) {
            this.task.type = type;
          }
        }),
        switchMap(_ => this.setupForm()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}

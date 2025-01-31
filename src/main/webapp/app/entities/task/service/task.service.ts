import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITask, ITaskDto, NewTask } from '../task.model';
import { TaskType } from '../../enumerations/task-type.model';

export type PartialUpdateTask = Partial<ITask> & Pick<ITask, 'id'>;

export type EntityResponseType = HttpResponse<ITaskDto>;
export type EntityArrayResponseType = HttpResponse<ITaskDto[]>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('tasks');

  create(task: NewTask): Observable<EntityResponseType> {
    return this.http.post<ITaskDto>(this.resourceUrl, this.mapRequestObject(task), { observe: 'response' });
  }

  update(task: ITask): Observable<EntityResponseType> {
    return this.http.put<ITaskDto>(`${this.resourceUrl}/${this.getTaskIdentifier(task)}`, this.mapRequestObject(task), {
      observe: 'response',
    });
  }

  partialUpdate(task: PartialUpdateTask): Observable<EntityResponseType> {
    return this.http.patch<ITaskDto>(`${this.resourceUrl}/${this.getTaskIdentifier(task)}`, this.mapRequestObject(task), {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITaskDto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskDto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTaskIdentifier(task: Pick<ITask, 'id'>): string {
    return task.id;
  }

  compareTask(o1: Pick<ITask, 'id'> | null, o2: Pick<ITask, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskIdentifier(o1) === this.getTaskIdentifier(o2) : o1 === o2;
  }

  addTaskToCollectionIfMissing<Type extends Pick<ITask, 'id'>>(
    taskCollection: Type[],
    ...tasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tasks: Type[] = tasksToCheck.filter(isPresent);
    if (tasks.length > 0) {
      const taskCollectionIdentifiers = taskCollection.map(taskItem => this.getTaskIdentifier(taskItem));
      const tasksToAdd = tasks.filter(taskItem => {
        const taskIdentifier = this.getTaskIdentifier(taskItem);
        if (taskCollectionIdentifiers.includes(taskIdentifier)) {
          return false;
        }
        taskCollectionIdentifiers.push(taskIdentifier);
        return true;
      });
      return [...tasksToAdd, ...taskCollection];
    }
    return taskCollection;
  }

  private mapRequestObject = (task: NewTask | ITask | PartialUpdateTask): ITaskDto => {
    return { ...task, _id: task.id, type: task.type ? TaskType[task.type] : task.type } as ITaskDto;
  };
}

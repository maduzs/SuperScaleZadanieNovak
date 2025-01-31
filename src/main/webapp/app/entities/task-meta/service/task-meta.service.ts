import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITaskMeta, NewTaskMeta } from '../task-meta.model';
import { MOCKED_CONFIG_ID, MOCKED_CONFIG_ID_2 } from '../../task-config/service/task-config.service';
import { filter, map } from 'rxjs/operators';
import { ITaskConfig } from '../../task-config/task-config.model';

export type PartialUpdateTaskMeta = Partial<ITaskMeta> & Pick<ITaskMeta, 'id'>;

export type EntityResponseType = HttpResponse<ITaskMeta>;
export type EntityArrayResponseType = HttpResponse<ITaskMeta[]>;

@Injectable({ providedIn: 'root' })
export class TaskMetaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/task-metas');

  // mock for API
  private mockedConfigs: ITaskMeta[] = [
    { id: 1234567890, name: 'durationInHours', type: 'NUMBER', taskConfig: { id: MOCKED_CONFIG_ID } },
    { id: 9876543210, name: 'who', type: 'STRING', taskConfig: { id: MOCKED_CONFIG_ID_2 } },
    { id: 4567891234, name: 'room', type: 'STRING', taskConfig: { id: MOCKED_CONFIG_ID_2 } },
  ];

  create(taskMeta: NewTaskMeta): Observable<EntityResponseType> {
    // return this.http.post<ITaskMeta>(this.resourceUrl, taskMeta, { observe: 'response' });

    const mockedCreate = { ...taskMeta, id: Math.random() } as ITaskMeta;
    this.mockedConfigs.push(mockedCreate);

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockedCreate,
    });

    return of(httpResponse);
  }

  update(taskMeta: ITaskMeta): Observable<EntityResponseType> {
    // return this.http.put<ITaskMeta>(`${this.resourceUrl}/${this.getTaskMetaIdentifier(taskMeta)}`, taskMeta, { observe: 'response' });

    this.mockedConfigs = this.mockedConfigs.map(c => (c.id === taskMeta.id ? taskMeta : c));

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs.find(c => c.id === taskMeta.id),
    });

    return of(httpResponse);
  }

  partialUpdate(taskMeta: PartialUpdateTaskMeta): Observable<EntityResponseType> {
    // return this.http.patch<ITaskMeta>(`${this.resourceUrl}/${this.getTaskMetaIdentifier(taskMeta)}`, taskMeta, { observe: 'response' });

    this.mockedConfigs = this.mockedConfigs.map(c => (c.id === taskMeta.id ? taskMeta : c));

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs.find(c => c.id === taskMeta.id),
    });

    return of(httpResponse);
  }

  find(id: number): Observable<EntityResponseType> {
    // return this.http.get<ITaskMeta>(`${this.resourceUrl}/${id}`, { observe: 'response' });

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs.find(c => c.id === id),
    });

    return of(httpResponse);
  }

  // TODO not supporting querying for this assignment
  query(req?: any): Observable<EntityArrayResponseType> {
    // const options = createRequestOption(req);
    // return this.http.get<ITaskMeta[]>(this.resourceUrl, { params: options, observe: 'response' });

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs,
    });

    return of(httpResponse);
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    // return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });

    this.mockedConfigs = this.mockedConfigs.filter(c => c.id !== id);

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: {},
    });

    return of(httpResponse);
  }

  getTaskMetaIdentifier(taskMeta: Pick<ITaskMeta, 'id'>): number {
    return taskMeta.id;
  }

  compareTaskMeta(o1: Pick<ITaskMeta, 'id'> | null, o2: Pick<ITaskMeta, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskMetaIdentifier(o1) === this.getTaskMetaIdentifier(o2) : o1 === o2;
  }

  addTaskMetaToCollectionIfMissing<Type extends Pick<ITaskMeta, 'id'>>(
    taskMetaCollection: Type[],
    ...taskMetasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const taskMetas: Type[] = taskMetasToCheck.filter(isPresent);
    if (taskMetas.length > 0) {
      const taskMetaCollectionIdentifiers = taskMetaCollection.map(taskMetaItem => this.getTaskMetaIdentifier(taskMetaItem));
      const taskMetasToAdd = taskMetas.filter(taskMetaItem => {
        const taskMetaIdentifier = this.getTaskMetaIdentifier(taskMetaItem);
        if (taskMetaCollectionIdentifiers.includes(taskMetaIdentifier)) {
          return false;
        }
        taskMetaCollectionIdentifiers.push(taskMetaIdentifier);
        return true;
      });
      return [...taskMetasToAdd, ...taskMetaCollection];
    }
    return taskMetaCollection;
  }

  getFieldMetaByTaskConfig(ids: string[]): Observable<ITaskMeta[]> {
    return this.query().pipe(
      map(response => response.body),
      filter(response => response != null),
      map(response => response.filter(r => !!r.taskConfig && ids.includes(r.taskConfig.id))),
    );
  }
}

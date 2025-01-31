import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ITaskConfig, NewTaskConfig } from '../task-config.model';
import { mapToTaskType, TaskType } from '../../enumerations/task-type.model';
import { filter, map } from 'rxjs/operators';

export type PartialUpdateTaskConfig = Partial<ITaskConfig> & Pick<ITaskConfig, 'id'>;

export type EntityResponseType = HttpResponse<ITaskConfig>;
export type EntityArrayResponseType = HttpResponse<ITaskConfig[]>;

export const generateAlphanumericUUID = (length = 32): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
};

export const MOCKED_CONFIG_ID = 'tJW1teVseIkecmETh7Vo7IKy2x4XF6tn';
export const MOCKED_CONFIG_ID_2 = 'jUlKqwmvYpNVSAqzguSA6vyWHmc1Q7Z0';

@Injectable({ providedIn: 'root' })
export class TaskConfigService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/task-mockedConfigs');

  // mock for API
  private mockedConfigs: ITaskConfig[] = [
    { id: MOCKED_CONFIG_ID, type: 'WASH_DISHES' },
    { id: MOCKED_CONFIG_ID_2, type: 'VACUUM_CLEAN' },
  ];

  create(taskConfig: NewTaskConfig): Observable<EntityResponseType> {
    // return this.http.post<ITaskConfig>(this.resourceUrl, taskConfig, { observe: 'response' });

    const mockedCreate = { ...taskConfig, id: generateAlphanumericUUID() } as ITaskConfig;
    this.mockedConfigs.push(mockedCreate);

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: mockedCreate,
    });

    return of(httpResponse);
  }

  update(taskConfig: ITaskConfig): Observable<EntityResponseType> {
    // return this.http.put<ITaskConfig>(`${this.resourceUrl}/${this.getTaskConfigIdentifier(taskConfig)}`, taskConfig, {
    //   observe: 'response',
    // });

    this.mockedConfigs = this.mockedConfigs.map(c => (c.id === taskConfig.id ? taskConfig : c));

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs.find(c => c.id === taskConfig.id),
    });

    return of(httpResponse);
  }

  partialUpdate(taskConfig: PartialUpdateTaskConfig): Observable<EntityResponseType> {
    // return this.http.patch<ITaskConfig>(`${this.resourceUrl}/${this.getTaskConfigIdentifier(taskConfig)}`, taskConfig, {
    //   observe: 'response',
    // });

    this.mockedConfigs = this.mockedConfigs.map(c => (c.id === taskConfig.id ? taskConfig : c));

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs.find(c => c.id === taskConfig.id),
    });

    return of(httpResponse);
  }

  find(id: string): Observable<EntityResponseType> {
    // return this.http.get<ITaskConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' });

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
    // return this.http.get<ITaskConfig[]>(this.resourceUrl, { params: options, observe: 'response' });

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: this.mockedConfigs,
    });

    return of(httpResponse);
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    // return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });

    this.mockedConfigs = this.mockedConfigs.filter(c => c.id !== id);

    const httpResponse = new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: {},
    });

    return of(httpResponse);
  }

  getTaskConfigIdentifier(taskConfig: Pick<ITaskConfig, 'id'>): string {
    return taskConfig.id;
  }

  compareTaskConfig(o1: Pick<ITaskConfig, 'id'> | null, o2: Pick<ITaskConfig, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskConfigIdentifier(o1) === this.getTaskConfigIdentifier(o2) : o1 === o2;
  }

  addTaskConfigToCollectionIfMissing<Type extends Pick<ITaskConfig, 'id'>>(
    taskConfigCollection: Type[],
    ...taskConfigsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const taskConfigs: Type[] = taskConfigsToCheck.filter(isPresent);
    if (taskConfigs.length > 0) {
      const taskConfigCollectionIdentifiers = taskConfigCollection.map(taskConfigItem => this.getTaskConfigIdentifier(taskConfigItem));
      const taskConfigsToAdd = taskConfigs.filter(taskConfigItem => {
        const taskConfigIdentifier = this.getTaskConfigIdentifier(taskConfigItem);
        if (taskConfigCollectionIdentifiers.includes(taskConfigIdentifier)) {
          return false;
        }
        taskConfigCollectionIdentifiers.push(taskConfigIdentifier);
        return true;
      });
      return [...taskConfigsToAdd, ...taskConfigCollection];
    }
    return taskConfigCollection;
  }

  getConfigsByType(type: keyof typeof TaskType): Observable<string[]> {
    return this.query().pipe(
      map(res => res.body?.filter(r => r.type === type)),
      filter(res => res != null),
      map(res => res.map(r => r.id)),
    );
  }
}

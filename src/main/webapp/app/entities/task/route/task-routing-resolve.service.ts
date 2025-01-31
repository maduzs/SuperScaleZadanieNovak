import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITask, ITaskDto } from '../task.model';
import { TaskService } from '../service/task.service';
import { mapToTaskType } from '../../enumerations/task-type.model';

const taskResolve = (route: ActivatedRouteSnapshot): Observable<null | ITask> => {
  const id = route.params.id;
  if (id) {
    return inject(TaskService)
      .find(id)
      .pipe(
        mergeMap((task: HttpResponse<ITaskDto>) => {
          if (task.body) {
            const { _id, ...obj } = task.body;
            return of({ ...obj, id: task.body._id, type: mapToTaskType(task.body.type) } as ITask);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskResolve;

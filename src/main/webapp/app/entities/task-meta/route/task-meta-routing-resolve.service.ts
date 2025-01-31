import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITaskMeta } from '../task-meta.model';
import { TaskMetaService } from '../service/task-meta.service';

const taskMetaResolve = (route: ActivatedRouteSnapshot): Observable<null | ITaskMeta> => {
  const id = route.params.id;
  if (id && !isNaN(id)) {
    return inject(TaskMetaService)
      .find(+id)
      .pipe(
        mergeMap((taskMeta: HttpResponse<ITaskMeta>) => {
          if (taskMeta.body) {
            return of(taskMeta.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskMetaResolve;

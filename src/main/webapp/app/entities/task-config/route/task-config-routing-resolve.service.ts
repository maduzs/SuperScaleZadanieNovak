import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITaskConfig } from '../task-config.model';
import { TaskConfigService } from '../service/task-config.service';

const taskConfigResolve = (route: ActivatedRouteSnapshot): Observable<null | ITaskConfig> => {
  const id = route.params.id;
  if (id) {
    return inject(TaskConfigService)
      .find(id)
      .pipe(
        mergeMap((taskConfig: HttpResponse<ITaskConfig>) => {
          if (taskConfig.body) {
            return of(taskConfig.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskConfigResolve;

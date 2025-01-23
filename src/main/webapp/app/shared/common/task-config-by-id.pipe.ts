import { inject, Pipe, PipeTransform } from '@angular/core';
import { TaskConfigService } from '../../entities/task-config/service/task-config.service';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReadableEnumPipe } from '../enum/readableEnum.pipe';
import { TaskType } from '../../entities/enumerations/task-type.model';

@Pipe({
  name: 'taskConfigByIdAsync',
})
export class TaskConfigByIdPipe implements PipeTransform {
  taskConfigService = inject(TaskConfigService);
  // readableEnumPipe = inject(ReadableEnumPipe);

  transform(id: string | undefined): Observable<string> {
    if (!id?.length) {
      return of('');
    }

    return of(id).pipe(
      switchMap(() =>
        this.taskConfigService.find(id).pipe(
          startWith(id),
          map(response => {
            if (typeof response === 'string') {
              return id;
            } else {
              return response.body?.type?.length ? response.body.type : id;
            }
          }),
          catchError(() => of(id)),
        ),
      ),
    );
  }
}

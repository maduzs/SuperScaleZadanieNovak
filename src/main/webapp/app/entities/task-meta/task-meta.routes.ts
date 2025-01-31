import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TaskMetaResolve from './route/task-meta-routing-resolve.service';

const taskMetaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task-meta.component').then(m => m.TaskMetaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-meta-detail.component').then(m => m.TaskMetaDetailComponent),
    resolve: {
      taskMeta: TaskMetaResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-meta-update.component').then(m => m.TaskMetaUpdateComponent),
    resolve: {
      taskMeta: TaskMetaResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-meta-update.component').then(m => m.TaskMetaUpdateComponent),
    resolve: {
      taskMeta: TaskMetaResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
];

export default taskMetaRoute;

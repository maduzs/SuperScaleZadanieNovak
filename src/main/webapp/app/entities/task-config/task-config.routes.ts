import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import TaskConfigResolve from './route/task-config-routing-resolve.service';

const taskConfigRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task-config.component').then(m => m.TaskConfigComponent),
    data: {},
    // canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-config-detail.component').then(m => m.TaskConfigDetailComponent),
    resolve: {
      taskConfig: TaskConfigResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-config-update.component').then(m => m.TaskConfigUpdateComponent),
    resolve: {
      taskConfig: TaskConfigResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-config-update.component').then(m => m.TaskConfigUpdateComponent),
    resolve: {
      taskConfig: TaskConfigResolve,
    },
    // canActivate: [UserRouteAccessService],
  },
];

export default taskConfigRoute;

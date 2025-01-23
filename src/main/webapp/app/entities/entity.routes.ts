import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'task-meta',
    data: { pageTitle: 'TaskMetas' },
    loadChildren: () => import('./task-meta/task-meta.routes'),
  },
  {
    path: 'task-config',
    data: { pageTitle: 'TaskConfigs' },
    loadChildren: () => import('./task-config/task-config.routes'),
  },
  {
    path: 'task',
    data: { pageTitle: 'Tasks' },
    loadChildren: () => import('./task/task.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/users/pages/users-list/users-list').then((m) => m.UsersList),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

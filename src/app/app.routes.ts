import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/quiz-marketplace/quiz-marketplace.component'),
      },
      {
        path: 'quiz',
        loadComponent: () => import('./components/quiz/quiz.component'),
      },
      {
        path: 'quiz/:technology',
        loadComponent: () => import('./components/quiz/quiz.component'),
      },
      {
        path: 'result',
        loadComponent: () => import('./components/result/result.component'),
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

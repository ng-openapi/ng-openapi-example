import { Routes } from '@angular/router';
import {ExampleView} from './components/example-view/example-view';
import {Home} from './components/home/home';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: Home
  },
  {
    path: "example",
    component: ExampleView
  }
];

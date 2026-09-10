import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  { path: 'items', component: ItemListComponent },
];

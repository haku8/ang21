import { Component, OnInit, ViewChild, computed, effect, Signal } from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule
],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {
  displayedColumns = ['name', 'text1', 'text2', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<Item>();
  readonly loading: Signal<boolean>;
  readonly totalCount: Signal<number>;
  readonly error: Signal<string | null>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loading = this.itemService.loadingSignal;
    this.totalCount = this.itemService.totalCount;
    this.error = this.itemService.errorSignal;

    effect(() => {
      const items = this.itemService.itemsSignal();
      this.dataSource.data = items;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });

    effect(() => {
      const error = this.itemService.errorSignal();
      if (error) {
        this.snackBar.open(error, 'OK', { duration: 4000, panelClass: 'snack-error' });
      }
    });
  }

  ngOnInit(): void {
    this.itemService.loadItems();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openCreate(): void {
    const ref = this.dialog.open(ItemFormComponent, {
      data: {},
      width: '560px',
      disableClose: true,
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.itemService.createItem(result.name, result.text1 || null, result.text2 || null).subscribe({
        next: () => {
          this.snackBar.open('✅ Eintrag erstellt', '', { duration: 3000 });
          this.itemService.loadItems();
        },
        error: () => this.snackBar.open('Fehler beim Erstellen', 'OK', { duration: 4000, panelClass: 'snack-error' }),
      });
    });
  }

  openEdit(item: Item): void {
    const ref = this.dialog.open(ItemFormComponent, {
      data: { item },
      width: '560px',
      disableClose: true,
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.itemService.updateItem(item.id, result.name, result.text1 || null, result.text2 || null).subscribe({
        next: () => {
          this.snackBar.open('✅ Änderungen gespeichert', '', { duration: 3000 });
          this.itemService.loadItems();
        },
        error: () => this.snackBar.open('Fehler beim Speichern', 'OK', { duration: 4000, panelClass: 'snack-error' }),
      });
    });
  }

  confirmDelete(item: Item): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { name: item.name },
      width: '400px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.itemService.deleteItem(item.id).subscribe({
        next: () => {
          this.snackBar.open('🗑 Eintrag gelöscht', '', { duration: 3000 });
          this.itemService.loadItems();
        },
        error: () => this.snackBar.open('Fehler beim Löschen', 'OK', { duration: 4000, panelClass: 'snack-error' }),
      });
    });
  }

  formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  truncate(text?: string | null, max = 60): string {
    if (!text) return '—';
    return text.length > max ? text.slice(0, max) + '…' : text;
  }
}

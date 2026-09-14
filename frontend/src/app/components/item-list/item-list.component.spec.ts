import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ItemListComponent } from './item-list.component';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

type SpyObj<T> = T & { [K in keyof T]: jasmine.Spy };

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let itemServiceSpy: jasmine.SpyObj<ItemService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockItems: Item[] = [
    { id: '1', name: 'Item 1', text1: 'Text 1', text2: 'Text 2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Item 2', text1: null, text2: null, createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' }
  ];

  beforeEach(async () => {
    itemServiceSpy = jasmine.createSpyObj('ItemService', ['loadItems', 'createItem', 'updateItem', 'deleteItem']);
    Object.assign(itemServiceSpy, {
      itemsSignal: { value: mockItems } as any,
      loadingSignal: { value: false } as any,
      totalCount: { value: 2 } as any,
      errorSignal: { value: null } as any
    });

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
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
        MatChipsModule,
        ItemListComponent
      ],
      providers: [
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    component.ngOnInit();
    expect(itemServiceSpy.loadItems).toHaveBeenCalled();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['name', 'text1', 'text2', 'updatedAt', 'actions']);
  });

  describe('applyFilter', () => {
    it('should apply filter to data source', () => {
      const mockEvent = { target: { value: 'test' } } as unknown as Event;
      component.applyFilter(mockEvent);
      expect(component.dataSource.filter).toBe('test');
    });

    it('should trim and lowercase filter value', () => {
      const mockEvent = { target: { value: '  TEST  ' } } as unknown as Event;
      component.applyFilter(mockEvent);
      expect(component.dataSource.filter).toBe('test');
    });
  });

  describe('openCreate', () => {
    it('should open create dialog', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.openCreate();

      expect(dialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Object),
        jasmine.objectContaining({ data: {}, width: '560px', disableClose: true })
      );
    });

    it('should create item when dialog closes with result', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({ name: 'New Item', text1: 'Text 1', text2: 'Text 2' }));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.createItem.and.returnValue(of({} as Item));

      component.openCreate();

      expect(itemServiceSpy.createItem).toHaveBeenCalledWith('New Item', 'Text 1', 'Text 2');
    });

    it('should show success snackbar after creating item', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({ name: 'New Item', text1: 'Text 1', text2: 'Text 2' }));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.createItem.and.returnValue(of({} as Item));

      component.openCreate();

      expect(snackBarSpy.open).toHaveBeenCalledWith('✅ Eintrag erstellt', '', { duration: 3000 });
    });
  });

  describe('openEdit', () => {
    it('should open edit dialog with item data', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(null));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.openEdit(mockItems[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Object),
        jasmine.objectContaining({ data: { item: mockItems[0] }, width: '560px', disableClose: true })
      );
    });

    it('should update item when dialog closes with result', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({ name: 'Updated Item', text1: 'Updated Text 1', text2: 'Updated Text 2' }));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.updateItem.and.returnValue(of({} as Item));

      component.openEdit(mockItems[0]);

      expect(itemServiceSpy.updateItem).toHaveBeenCalledWith('1', 'Updated Item', 'Updated Text 1', 'Updated Text 2');
    });

    it('should show success snackbar after updating item', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({ name: 'Updated Item' }));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.updateItem.and.returnValue(of({} as Item));

      component.openEdit(mockItems[0]);

      expect(snackBarSpy.open).toHaveBeenCalledWith('✅ Änderungen gespeichert', '', { duration: 3000 });
    });
  });

  describe('confirmDelete', () => {
    it('should open confirm dialog', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(false));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.confirmDelete(mockItems[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(
        jasmine.any(Object),
        jasmine.objectContaining({ data: { name: 'Item 1' }, width: '400px' })
      );
    });

    it('should delete item when dialog closes with true', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.deleteItem.and.returnValue(of(true));

      component.confirmDelete(mockItems[0]);

      expect(itemServiceSpy.deleteItem).toHaveBeenCalledWith('1');
    });

    it('should show success snackbar after deleting item', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      itemServiceSpy.deleteItem.and.returnValue(of(true));

      component.confirmDelete(mockItems[0]);

      expect(snackBarSpy.open).toHaveBeenCalledWith('🗑 Eintrag gelöscht', '', { duration: 3000 });
    });

    it('should not delete item when dialog closes with false', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(false));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.confirmDelete(mockItems[0]);

      expect(itemServiceSpy.deleteItem).not.toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should return dash for null/undefined date', () => {
      expect(component.formatDate(undefined)).toBe('—');
    });

    it('should format ISO date to German locale', () => {
      const result = component.formatDate('2024-01-15T14:30:00Z');
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('truncate', () => {
    it('should return dash for null/undefined text', () => {
      expect(component.truncate(null)).toBe('—');
      expect(component.truncate(undefined)).toBe('—');
    });

    it('should return text as is if shorter than max', () => {
      expect(component.truncate('Short text')).toBe('Short text');
    });

    it('should truncate text longer than max and add ellipsis', () => {
      const longText = 'a'.repeat(100);
      const result = component.truncate(longText, 60);
      expect(result.length).toBe(61); // 60 chars + ellipsis
      expect(result.endsWith('…')).toBe(true);
    });
  });
});

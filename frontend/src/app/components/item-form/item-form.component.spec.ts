import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Validators } from '@angular/forms';

import { ItemFormComponent, ItemFormData } from './item-form.component';
import { Item } from '../../models/item.model';

type SpyObj<T> = T & { [K in keyof T]: jasmine.Spy };

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<ItemFormComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ItemFormComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    expect(component.isEdit).toBe(false);
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('text1')?.value).toBe('');
    expect(component.form.get('text2')?.value).toBe('');
  });

  it('should initialize form in edit mode with item data', () => {
    const mockItem: Item = {
      id: '1',
      name: 'Test Item',
      text1: 'Text 1',
      text2: 'Text 2'
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ItemFormComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { item: mockItem } as ItemFormData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEdit).toBe(true);
    expect(component.form.get('name')?.value).toBe('Test Item');
    expect(component.form.get('text1')?.value).toBe('Text 1');
    expect(component.form.get('text2')?.value).toBe('Text 2');
  });

  it('should have required validator on name field', () => {
    const nameControl = component.form.get('name');
    expect(nameControl?.hasValidator(Validators.required)).toBe(true);
  });

  it('should have maxLength validator on name field', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('a'.repeat(256));
    expect(nameControl?.valid).toBe(false);
  });

  it('should close dialog with form value on submit', () => {
    component.form.setValue({
      name: 'Test Item',
      text1: 'Text 1',
      text2: 'Text 2'
    });

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      name: 'Test Item',
      text1: 'Text 1',
      text2: 'Text 2'
    });
  });

  it('should not submit if form is invalid', () => {
    component.form.setValue({
      name: '',
      text1: 'Text 1',
      text2: 'Text 2'
    });

    component.onSubmit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close dialog without value on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="confirm-title">
      <mat-icon color="warn">warning</mat-icon>
      Eintrag löschen
    </h2>
    <mat-dialog-content>
      <p>Soll <strong>„{{ data.name }}"</strong> wirklich gelöscht werden?</p>
      <p class="hint">Diese Aktion kann nicht rückgängig gemacht werden.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button [mat-dialog-close]="false">Abbrechen</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">
        <mat-icon>delete</mat-icon> Löschen
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-title { display: flex; align-items: center; gap: 10px; padding: 20px 24px 8px; }
    mat-dialog-content p { margin: 8px 0; }
    .hint { color: #888; font-size: 0.85rem; }
    mat-dialog-actions { padding: 12px 24px 20px !important; gap: 10px; }
    button { display: flex; align-items: center; gap: 6px; }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}
}

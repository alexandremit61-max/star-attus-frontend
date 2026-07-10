import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PhoneType, User, UserPayload } from '../../../../core/models/user.model';

export interface UserDialogResult {
  id?: number;
  payload: UserPayload;
}

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog, UserDialogResult>);
  private readonly data = inject<User | null>(MAT_DIALOG_DATA, { optional: true });

  readonly phoneTypes: PhoneType[] = ['Celular', 'Residencial', 'Comercial'];
  readonly isEditing = computed(() => Boolean(this.data?.id));

  readonly form = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', [Validators.required]],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    cpf: [this.data?.cpf ?? '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    phone: [this.data?.phone ?? '', [Validators.required]],
    phoneType: [this.data?.phoneType ?? ('Celular' as PhoneType), [Validators.required]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      id: this.data?.id,
      payload: this.form.getRawValue(),
    });
  }
}

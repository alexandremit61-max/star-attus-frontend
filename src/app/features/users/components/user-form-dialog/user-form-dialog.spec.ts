import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserFormDialog } from './user-form-dialog';

describe('UserFormDialog', () => {
  let fixture: ComponentFixture<UserFormDialog>;
  let component: UserFormDialog;
  const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserFormDialog>>('MatDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormDialog, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with an invalid form and disabled save button', () => {
    const button = fixture.nativeElement.querySelector('button[mat-flat-button]') as HTMLButtonElement;

    expect(component.form.invalid).toBeTrue();
    expect(button.disabled).toBeTrue();
  });

  it('should close with payload when form is valid', () => {
    component.form.setValue({
      name: 'Maria Costa',
      email: 'maria@attus.com.br',
      cpf: '11122233344',
      phone: '85988887777',
      phoneType: 'Celular',
    });

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      id: undefined,
      payload: component.form.getRawValue(),
    });
  });
});

describe('UserFormDialog editing', () => {
  it('should prefill data and close with the existing id', async () => {
    const editDialogRefSpy = jasmine.createSpyObj<MatDialogRef<UserFormDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [UserFormDialog, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: editDialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 4,
            name: 'Diego Fernandes',
            email: 'diego@attus.com.br',
            cpf: '45678901234',
            phone: '85988887777',
            phoneType: 'Celular',
          },
        },
      ],
    }).compileComponents();

    const editFixture = TestBed.createComponent(UserFormDialog);
    const editComponent = editFixture.componentInstance;

    expect(editComponent.isEditing()).toBeTrue();
    expect(editComponent.form.controls.name.value).toBe('Diego Fernandes');

    editComponent.save();

    expect(editDialogRefSpy.close).toHaveBeenCalledWith({
      id: 4,
      payload: editComponent.form.getRawValue(),
    });
  });
});

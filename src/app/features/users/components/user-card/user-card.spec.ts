import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../../../core/models/user.model';
import { UserCard } from './user-card';

describe('UserCard', () => {
  let fixture: ComponentFixture<UserCard>;
  const user: User = {
    id: 1,
    name: 'Ana Silva',
    email: 'ana@attus.com.br',
    cpf: '12345678901',
    phone: '85999990000',
    phoneType: 'Celular',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
  });

  it('should render user data with masked CPF', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Ana Silva');
    expect(text).toContain('ana@attus.com.br');
    expect(text).toContain('person');
  });

  it('should emit edit events', () => {
    const component = fixture.componentInstance;
    const editSpy = jasmine.createSpy('edit');

    component.edit.subscribe(editSpy);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(editSpy).toHaveBeenCalledWith(user);
  });
});

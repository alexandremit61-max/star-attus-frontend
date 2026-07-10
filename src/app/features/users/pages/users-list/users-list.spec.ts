import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UsersList } from './users-list';
import { UsersService } from '../../services/users.service';

describe('UsersList', () => {
  let fixture: ComponentFixture<UsersList>;
  let component: UsersList;
  const usersServiceSpy = jasmine.createSpyObj<UsersService>('UsersService', [
    'getUsers',
    'createUser',
    'updateUser',
    'deleteUser',
  ]);

  beforeEach(async () => {
    usersServiceSpy.getUsers.and.returnValue(
      of([
        {
          id: 1,
          name: 'Ana Silva',
          email: 'ana@attus.com.br',
          cpf: '12345678901',
          phone: '85999990000',
          phoneType: 'Celular',
        },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [UsersList, NoopAnimationsModule],
      providers: [{ provide: UsersService, useValue: usersServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load users into a signal', () => {
    expect(component.users().length).toBe(1);
    expect(component.users()[0].name).toBe('Ana Silva');
  });

  it('should track users by id', () => {
    expect(component.trackByUserId(0, component.users()[0])).toBe(1);
  });

  it('should delete a user and refresh the list', () => {
    usersServiceSpy.deleteUser.and.returnValue(of(void 0));
    usersServiceSpy.getUsers.calls.reset();

    component.deleteUser(component.users()[0]);

    expect(usersServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(usersServiceSpy.getUsers).toHaveBeenCalled();
  });

  it('should create a user from dialog result', () => {
    const payload = {
      name: 'Maria Costa',
      email: 'maria@attus.com.br',
      cpf: '11122233344',
      phone: '85988887777',
      phoneType: 'Celular' as const,
    };

    usersServiceSpy.createUser.and.returnValue(of({ id: 8, ...payload }));
    spyOn((component as unknown as { dialog: { open: jasmine.Spy } }).dialog, 'open').and.returnValue({
      afterClosed: () => of({ payload }),
    } as never);

    component.openCreateDialog();

    expect(usersServiceSpy.createUser).toHaveBeenCalledWith(payload);
  });

  it('should update a user from dialog result', () => {
    const user = component.users()[0];
    const payload = {
      name: 'Ana Atualizada',
      email: 'ana@attus.com.br',
      cpf: '12345678901',
      phone: '85999990000',
      phoneType: 'Celular' as const,
    };

    usersServiceSpy.updateUser.and.returnValue(of({ id: user.id, ...payload }));
    spyOn((component as unknown as { dialog: { open: jasmine.Spy } }).dialog, 'open').and.returnValue({
      afterClosed: () => of({ id: user.id, payload }),
    } as never);

    component.openEditDialog(user);

    expect(usersServiceSpy.updateUser).toHaveBeenCalledWith(user.id, payload);
  });
});

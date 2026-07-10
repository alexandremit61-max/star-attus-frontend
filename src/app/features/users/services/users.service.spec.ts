import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users with a name filter', () => {
    service.getUsers('Ana').subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Ana Silva');
    });

    const request = httpMock.expectOne('http://localhost:3000/users');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 1,
        name: 'Ana Silva',
        email: 'ana@attus.com.br',
        cpf: '12345678901',
        phone: '85999990000',
        phoneType: 'Celular',
      },
      {
        id: 2,
        name: 'Bruno Carvalho',
        email: 'bruno@attus.com.br',
        cpf: '23456789012',
        phone: '8533334444',
        phoneType: 'Comercial',
      },
    ]);
  });

  it('should update users by id', () => {
    const payload = {
      name: 'Joao Lima',
      email: 'joao@attus.com.br',
      cpf: '98765432100',
      phone: '8533334444',
      phoneType: 'Comercial' as const,
    };

    service.updateUser(7, payload).subscribe((user) => expect(user.id).toBe(7));

    const request = httpMock.expectOne('http://localhost:3000/users/7');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(payload);
    request.flush({ id: 7, ...payload });
  });

  it('should create and delete users', () => {
    const payload = {
      name: 'Lia Souza',
      email: 'lia@attus.com.br',
      cpf: '11122233344',
      phone: '85977776666',
      phoneType: 'Celular' as const,
    };

    service.createUser(payload).subscribe((user) => expect(user.id).toBe(9));

    const createRequest = httpMock.expectOne('http://localhost:3000/users');
    expect(createRequest.request.method).toBe('POST');
    createRequest.flush({ id: 9, ...payload });

    service.deleteUser(9).subscribe((result) => expect(result).toBeNull());

    const deleteRequest = httpMock.expectOne('http://localhost:3000/users/9');
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);
  });
});

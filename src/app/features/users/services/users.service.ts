import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserPayload } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/users';

  getUsers(searchTerm = ''): Observable<User[]> {
    const term = searchTerm.trim().toLowerCase();

    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(
        map((users) =>
          term ? users.filter((user) => user.name.toLowerCase().includes(term)) : users,
        ),
      );
  }

  createUser(payload: UserPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }

  updateUser(id: number, payload: UserPayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

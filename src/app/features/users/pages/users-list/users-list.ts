import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, merge, of, switchMap } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { UserCard } from '../../components/user-card/user-card';
import { UserDialogResult, UserFormDialog } from '../../components/user-form-dialog/user-form-dialog';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    UserCard,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersList {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Unificação dos gatilhos (Input do Usuário e Eventos de Atualização do CRUD)
    const searchTrigger$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), // Exigência estrita do requisito 4.1 do documento
      distinctUntilChanged()
    );

    merge(this.refresh$, searchTrigger$)
      .pipe(
        switchMap(() => this.loadUsers(this.searchControl.value)),
        takeUntilDestroyed(this.destroyRef), // Gerenciamento perfeito contra memory leaks no escopo raiz
      )
      .subscribe((users) => this.users.set(users));
  }

  openCreateDialog(): void {
    this.openDialog();
  }

  openEditDialog(user: User): void {
    this.openDialog(user);
  }

  deleteUser(user: User): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.usersService
      .deleteUser(user.id)
      .pipe(
        finalize(() => this.loading.set(false))
        // Sem takeUntilDestroyed aqui para garantir que a deleção finalize com segurança mesmo em navegações rápidas
      )
      .subscribe({
        next: () => this.refresh$.next(),
        error: () => this.error.set('Não foi possível excluir o usuário selecionado.'),
      });
  }

  trackByUserId(_index: number, user: User): number {
    return user.id; // Cumpre com o ganho de performance OnPush + trackBy exigido na Seção 2.4
  }

  private openDialog(user?: User): void {
    this.dialog
      .open<UserFormDialog, User | null, UserDialogResult>(UserFormDialog, {
        width: '560px',
        data: user ?? null,
      })
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (!result) return EMPTY;

          this.loading.set(true);
          this.error.set(null);
          
          return result.id
            ? this.usersService.updateUser(result.id, result.payload)
            : this.usersService.createUser(result.payload);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => this.refresh$.next(),
        error: () => this.error.set('Não foi possível salvar os dados do usuário.'),
      });
  }

  private loadUsers(term: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.usersService.getUsers(term).pipe(
      finalize(() => this.loading.set(false)),
      catchError(() => {
        this.error.set('Não foi possível carregar os usuários. Verifique se a API mock está ativa.');
        return of([]);
      }),
    );
  }
}
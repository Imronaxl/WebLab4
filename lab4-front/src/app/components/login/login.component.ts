import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex justify-content-center align-items-center h-screen bg-gray-50 p-3">
      <p-card header="Лабораторная работа №4" [style]="{width: '400px'}" class="shadow-5">
        <div class="mb-4 text-center border-bottom pb-3">
          <h3 class="mb-2">Студент: Гулахмадзода Имрон</h3>
          <p class="mb-1 text-sm">Группа: P3232</p>
          <p class="mb-0 text-sm">Вариант: 32434212</p>
        </div>
        
        <div class="field mb-4">
          <label for="username" class="block mb-2 font-medium">Логин</label>
          <input 
            id="username" 
            type="text" 
            pInputText 
            [(ngModel)]="authRequest.username" 
            class="w-full" 
            placeholder="Введите логин"
            [disabled]="loading"
          />
        </div>
        
        <div class="field mb-4">
          <label for="password" class="block mb-2 font-medium">Пароль</label>
          <input 
            id="password" 
            type="password" 
            pInputText 
            [(ngModel)]="authRequest.password" 
            class="w-full" 
            placeholder="Введите пароль"
            [disabled]="loading"
          />
        </div>
        
        <div class="flex flex-column gap-3">
          <p-button 
            label="Войти" 
            icon="pi pi-sign-in" 
            (click)="login()" 
            [loading]="loading"
            class="w-full"
          ></p-button>
          
          <p-button 
            label="Зарегистрироваться" 
            icon="pi pi-user-plus" 
            severity="secondary" 
            (click)="register()"
            [loading]="loading"
            class="w-full"
          ></p-button>
        </div>
        
        <div class="mt-4 text-center text-sm text-color-secondary">
          Для продолжения войдите или зарегистрируйтесь
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .h-screen { min-height: 100vh; }
  `]
})
export class LoginComponent {
  authRequest: AuthRequest = { username: '', password: '' };
  loading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  
  login(): void {
    if (!this.validateForm()) return;
    
    this.loading = true;
    this.authService.login(this.authRequest).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Вход выполнен'
        });
        this.authRequest = { username: '', password: '' };
        this.router.navigate(['/main']);
      },
      error: (error) => {
        const message = error?.error?.message || 'Неверный логин или пароль';
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка входа',
          detail: message
        });
        this.loading = false;
      }
    });
  }
  
  register(): void {
    if (!this.validateForm()) return;
    
    this.loading = true;
    this.authService.register(this.authRequest).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Регистрация успешна! Введите учетные данные для входа.'
        });
        this.authRequest = { username: '', password: '' };
        this.loading = false;
      },
      error: (error) => {
        const message = error?.error?.message
          || (error?.status === 409 ? 'Пользователь с таким логином уже существует' : 'Ошибка регистрации. Попробуйте еще раз.');
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка регистрации',
          detail: message
        });
        this.loading = false;
      }
    });
  }
  
  private validateForm(): boolean {
    if (!this.authRequest.username.trim() || !this.authRequest.password.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Заполните логин и пароль'
      });
      return false;
    }
    
    if (this.authRequest.username.length < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Логин должен быть не менее 3 символов'
      });
      return false;
    }
    
    if (this.authRequest.password.length < 3) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Пароль должен быть не менее 3 символов'
      });
      return false;
    }
    
    return true;
  }
}

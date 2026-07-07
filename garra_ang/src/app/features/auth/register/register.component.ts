import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AutenticacaoService } from '../autenticacao.service';

function senhasIguaisValidator(): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const senha = grupo.get('senha')?.value;
    const confirmarSenha = grupo.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacaoService = inject(AutenticacaoService);
  private readonly router = inject(Router);

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group(
    {
      login: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    },
    { validators: senhasIguaisValidator() }
  );

  campoInvalido(nome: 'login' | 'senha' | 'confirmarSenha'): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && (campo.dirty || campo.touched);
  }

  senhasDivergem(): boolean {
    const confirmarSenha = this.formulario.get('confirmarSenha');
    return (
      this.formulario.hasError('senhasDiferentes') &&
      !!confirmarSenha &&
      (confirmarSenha.dirty || confirmarSenha.touched)
    );
  }

  cadastrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    const { login, senha } = this.formulario.getRawValue();

    this.autenticacaoService
      .register({ login, senha })
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/login'], { queryParams: { registrado: '1' } }),
        error: (erro: Error) => this.erro.set(erro.message),
      });
  }
}

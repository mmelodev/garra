import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AutenticacaoService, SessaoService } from '../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly autenticacaoService = inject(AutenticacaoService);
  private readonly sessaoService = inject(SessaoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly cadastroConcluido = signal(this.rota.snapshot.queryParamMap.get('registrado') === '1');

  readonly formulario = this.fb.nonNullable.group({
    login: ['', [Validators.required]],
    senha: ['', [Validators.required]],
  });

  campoInvalido(nome: 'login' | 'senha'): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && (campo.dirty || campo.touched);
  }

  entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);
    this.cadastroConcluido.set(false);

    this.autenticacaoService
      .login(this.formulario.getRawValue())
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (token) => {
          this.sessaoService.salvarToken(token.token);
          this.router.navigateByUrl('/professores');
        },
        error: (erro: Error) => this.erro.set(erro.message),
      });
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { DadosAluno, DadosAtualizarAluno, DadosListagemProfessor, Professor } from '@models';

import { ProfessorService } from '../../professores/professor.service';
import { AlunoService } from '../aluno.service';

type CampoFormulario =
  | 'nome'
  | 'professorId'
  | 'sexo'
  | 'endereco'
  | 'email'
  | 'nomeMae'
  | 'nomePai'
  | 'whatsapp'
  | 'possuiBolsa'
  | 'dataMatricula'
  | 'rg'
  | 'cpf';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-form.component.html',
})
export class AlunoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alunoService = inject(AlunoService);
  private readonly professorService = inject(ProfessorService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  readonly professores = signal<DadosListagemProfessor[]>([]);

  readonly carregandoDados = signal(false);
  readonly salvando = signal(false);
  readonly excluindo = signal(false);
  readonly erro = signal<string | null>(null);

  private readonly idParaEditar = Number(this.rota.snapshot.paramMap.get('id')) || null;
  readonly modoEdicao = this.idParaEditar !== null;

  readonly formulario = this.fb.group({
    nome: this.fb.control<string | null>(null, [Validators.required]),
    professorId: this.fb.control<number | null>(null),
    sexo: this.fb.control<string | null>(null),
    endereco: this.fb.control<string | null>(null),
    email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
    nomeMae: this.fb.control<string | null>(null),
    nomePai: this.fb.control<string | null>(null),
    whatsapp: this.fb.control<string | null>(null, [Validators.required]),
    possuiBolsa: this.fb.control<string | null>(null, [Validators.required]),
    dataMatricula: this.fb.control<string | null>(null, [Validators.required]),
    rg: this.fb.control<string | null>(null, [Validators.required]),
    cpf: this.fb.control<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.professorService.getAll().subscribe({
      next: (professores) => this.professores.set(professores),
      error: () => this.professores.set([]),
    });

    if (this.idParaEditar !== null) {
      /**
       * `PUT /aluno` (`DadosAtualizarAluno`) só aceita nome, professor, email, whatsapp e
       * endereco — sexo/nomeMae/nomePai/possuiBolsa/dataMatricula/rg/cpf ficam desabilitados
       * em modo edição por não terem como ser persistidos pelo back-end (mesmo padrão do
       * ProfessorFormComponent para os campos fora de DadosAtualizarProfessor).
       */
      this.formulario.controls.sexo.disable();
      this.formulario.controls.nomeMae.disable();
      this.formulario.controls.nomePai.disable();
      this.formulario.controls.possuiBolsa.disable();
      this.formulario.controls.dataMatricula.disable();
      this.formulario.controls.rg.disable();
      this.formulario.controls.cpf.disable();

      this.carregandoDados.set(true);
      this.alunoService
        .getById(this.idParaEditar)
        .pipe(finalize(() => this.carregandoDados.set(false)))
        .subscribe({
          next: (aluno) => {
            this.formulario.patchValue({
              nome: aluno.nome,
              professorId: aluno.professor?.id ?? null,
              sexo: aluno.sexo,
              endereco: aluno.endereco,
              email: aluno.email,
              nomeMae: aluno.nomeMae ?? null,
              nomePai: aluno.nomePai ?? null,
              whatsapp: aluno.whatsapp,
              possuiBolsa: aluno.possuiBolsa ? 'true' : 'false',
              dataMatricula: aluno.dataMatricula,
              rg: aluno.rg,
              cpf: aluno.cpf,
            });
          },
          error: (erro: Error) => this.erro.set(erro.message),
        });
    }
  }

  campoInvalido(nome: CampoFormulario): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && (campo.dirty || campo.touched);
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    const valores = this.formulario.getRawValue();

    const requisicao =
      this.idParaEditar !== null
        ? this.alunoService.update(this.idParaEditar, {
            id: this.idParaEditar,
            nome: valores.nome!,
            // DadosAtualizarAluno.professor espera o objeto Professor completo, mas o
            // back-end só precisa do id para resolver a referência JPA (@ManyToOne) —
            // mesma lógica do "id: 0" documentado em DadosProfessor (create).
            professor: valores.professorId ? ({ id: valores.professorId } as Professor) : undefined,
            email: valores.email!,
            whatsapp: valores.whatsapp!,
            endereco: valores.endereco ?? undefined,
          } satisfies DadosAtualizarAluno)
        : this.alunoService.create({
            nome: valores.nome!,
            professorId: valores.professorId ?? undefined,
            sexo: valores.sexo ?? undefined,
            endereco: valores.endereco ?? undefined,
            email: valores.email!,
            nomeMae: valores.nomeMae ?? undefined,
            nomePai: valores.nomePai ?? undefined,
            whatsapp: valores.whatsapp!,
            possuiBolsa: valores.possuiBolsa!,
            dataMatricula: valores.dataMatricula!,
            rg: valores.rg!,
            cpf: valores.cpf!,
          } satisfies DadosAluno);

    requisicao
      .pipe(
        catchError((erro: Error) => {
          this.erro.set(erro.message);
          return of(null);
        }),
        finalize(() => this.salvando.set(false))
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.router.navigateByUrl('/alunos');
        }
      });
  }

  excluir(): void {
    if (this.idParaEditar === null) {
      return;
    }
    if (!confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.excluindo.set(true);
    this.erro.set(null);

    this.alunoService
      .delete(this.idParaEditar)
      .pipe(
        catchError((erro: Error) => {
          this.erro.set(erro.message);
          return of(null);
        }),
        finalize(() => this.excluindo.set(false))
      )
      .subscribe((resultado) => {
        if (resultado !== null) {
          this.router.navigateByUrl('/alunos');
        }
      });
  }
}

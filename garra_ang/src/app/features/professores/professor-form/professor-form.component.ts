import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { AreaConhecimento, DadosAtualizarProfessor, DadosProfessor, ROTULOS_AREA_CONHECIMENTO } from '@models';

import { ProfessorService } from '../professor.service';

type CampoFormulario =
  | 'nome'
  | 'areaConhecimento'
  | 'genero'
  | 'dataNascimento'
  | 'rg'
  | 'cpf'
  | 'email'
  | 'whatsapp'
  | 'dataDeEntrada'
  | 'dataDeSaida'
  | 'descricao';

@Component({
  selector: 'app-professor-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './professor-form.component.html',
})
export class ProfessorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly professorService = inject(ProfessorService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  readonly areas = Object.entries(ROTULOS_AREA_CONHECIMENTO) as [AreaConhecimento, string][];

  readonly carregandoDados = signal(false);
  readonly salvando = signal(false);
  readonly excluindo = signal(false);
  readonly erro = signal<string | null>(null);

  private readonly idParaEditar = Number(this.rota.snapshot.paramMap.get('id')) || null;
  readonly modoEdicao = this.idParaEditar !== null;

  /**
   * `PUT /professor` (`DadosAtualizarProfessor`) só aceita atualizar nome, areaConhecimento,
   * email, whatsapp, dataDeSaida e descricao — genero/dataNascimento/rg/cpf/dataDeEntrada
   * ficam desabilitados em modo edição por não terem como ser persistidos pelo back-end.
   */
  readonly formulario = this.fb.group({
    nome: this.fb.control<string | null>(null, [Validators.required]),
    areaConhecimento: this.fb.control<AreaConhecimento | null>(null, [Validators.required]),
    genero: this.fb.control<string | null>(null),
    dataNascimento: this.fb.control<string | null>(null),
    rg: this.fb.control<string | null>(null, [Validators.required]),
    cpf: this.fb.control<string | null>(null, [Validators.required]),
    email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
    whatsapp: this.fb.control<string | null>(null, [Validators.required]),
    dataDeEntrada: this.fb.control<string | null>(null, [Validators.required]),
    dataDeSaida: this.fb.control<string | null>(null),
    descricao: this.fb.control<string | null>(null),
  });

  ngOnInit(): void {
    if (this.idParaEditar !== null) {
      this.formulario.controls.genero.disable();
      this.formulario.controls.dataNascimento.disable();
      this.formulario.controls.rg.disable();
      this.formulario.controls.cpf.disable();
      this.formulario.controls.dataDeEntrada.disable();

      this.carregandoDados.set(true);
      this.professorService
        .getById(this.idParaEditar)
        .pipe(finalize(() => this.carregandoDados.set(false)))
        .subscribe({
          next: (professor) => {
            this.formulario.patchValue({
              nome: professor.nome,
              areaConhecimento: professor.areaConhecimento,
              genero: professor.genero,
              dataNascimento: professor.dataNascimento,
              rg: professor.rg,
              cpf: professor.cpf,
              email: professor.email,
              whatsapp: professor.whatsapp,
              dataDeEntrada: professor.dataDeEntrada,
              dataDeSaida: professor.dataDeSaida ?? null,
              descricao: professor.descricao ?? null,
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
        ? this.professorService.update(this.idParaEditar, {
            id: this.idParaEditar,
            nome: valores.nome!,
            areaConhecimento: valores.areaConhecimento!,
            email: valores.email!,
            whatsapp: valores.whatsapp!,
            dataDeSaida: valores.dataDeSaida ?? undefined,
            descricao: valores.descricao ?? undefined,
          } satisfies DadosAtualizarProfessor)
        : this.professorService.create({
            id: 0,
            nome: valores.nome!,
            areaConhecimento: valores.areaConhecimento!,
            genero: valores.genero ?? undefined,
            dataNascimento: valores.dataNascimento ?? undefined,
            rg: valores.rg!,
            cpf: valores.cpf!,
            email: valores.email!,
            whatsapp: valores.whatsapp!,
            dataDeEntrada: valores.dataDeEntrada!,
            dataDeSaida: valores.dataDeSaida ?? undefined,
            descricao: valores.descricao ?? undefined,
          } satisfies DadosProfessor);

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
          this.router.navigateByUrl('/professores');
        }
      });
  }

  excluir(): void {
    if (this.idParaEditar === null) {
      return;
    }
    if (!confirm('Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.excluindo.set(true);
    this.erro.set(null);

    this.professorService
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
          this.router.navigateByUrl('/professores');
        }
      });
  }
}

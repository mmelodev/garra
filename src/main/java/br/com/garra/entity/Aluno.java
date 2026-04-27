package br.com.garra.entity;
import br.com.garra.dto.DadosAtualizarAluno;
import br.com.garra.model.DadosAluno;
import jakarta.persistence.*;

import java.time.LocalDate;

@Table(name="aluno")
@Entity(name="Aluno")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //implementar UUID posteriormente para novos alunos
    private Long id;
    @Column(nullable = false)
    private Boolean ativo;
    @Column(length = 100, nullable = false)
    private String nome;
    private String sexo;
    private String endereco;
    @Column(nullable = false)
    private String email;
    //estudar se ENUMs fazem sentido aqui.
    private String nomeMae;
    private String nomePai;
    @Column(nullable = false)
    private String whatsapp;
    @Column(nullable = false)
    private Boolean possuiBolsa;
    private LocalDate dataMatricula;
    @Column(nullable = false)
    private String rg;
    @Column(nullable = false)
    private String cpf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id")
    private Professor professor;

    public Aluno (){
    }

    public Aluno (DadosAluno aluno) {
        this.ativo = true;
        this.nome = aluno.nome();
        this.sexo = aluno.sexo();
        this.endereco = aluno.endereco();
        this.email = aluno.email();
        this.nomeMae = aluno.nomeMae();
        this.nomePai = aluno.nomePai();
        this.whatsapp = aluno.whatsapp();
        this.possuiBolsa = Boolean.valueOf(aluno.possuiBolsa());
        this.dataMatricula = LocalDate.parse(aluno.dataMatricula());
        this.rg = aluno.rg();
        this.cpf = aluno.cpf();
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSexo() {
        return sexo;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNomeMae() {
        return nomeMae;
    }

    public String getNomePai() {
        return nomePai;
    }

    public String getWhatsapp() {
        return whatsapp;
    }

    public void setWhatsapp(String whatsapp) {
        this.whatsapp = whatsapp;
    }

    public Boolean getPossuiBolsa() {
        return possuiBolsa;
    }

    public LocalDate getDataMatricula() {
        return dataMatricula;
    }

    public String getRg() {
        return rg;
    }

    public String getCpf() {
        return cpf;
    }


    public void atualizarCadastroAluno (DadosAtualizarAluno dados){
        if(dados.nome() != null){
            this.nome = dados.nome();
        }

        if(dados.professor() != null){
            this.professor = dados.professor();
        }

        if(dados.email() != null){
            this.email = dados.email();
        }

        if(dados.whatsapp() != null){
            this.whatsapp = dados.whatsapp();
        }

        if (dados.endereco() != null){
            this.endereco = dados.endereco();
        }
    }

    public void inativarAluno (){
        this.ativo = false;
    }
}

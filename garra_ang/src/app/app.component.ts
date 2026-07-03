import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { SessaoService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly sessaoService = inject(SessaoService);
  private readonly router = inject(Router);

  sair(): void {
    this.sessaoService.encerrarSessao();
    this.router.navigateByUrl('/login');
  }
}

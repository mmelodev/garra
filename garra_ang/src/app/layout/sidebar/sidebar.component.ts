import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SessaoService } from '../../core/services';
import { UiIconComponent } from '../../shared/components/ui-icon/ui-icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiIconComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  protected readonly sessaoService = inject(SessaoService);
  private readonly router = inject(Router);

  sair(): void {
    this.sessaoService.encerrarSessao();
    this.router.navigateByUrl('/login');
  }
}

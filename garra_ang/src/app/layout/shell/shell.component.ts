import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SessaoService } from '../../core/services';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  protected readonly sessaoService = inject(SessaoService);
}

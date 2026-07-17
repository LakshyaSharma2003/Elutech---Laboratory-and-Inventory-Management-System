import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../../shared/toast/toast';
import { ThemeService } from '../../core/services/theme.service';
import { LiquidGlassComponent } from '../../shared/liquid-glass/liquid-glass.component';
import { CommandPaletteComponent } from '../../shared/command-palette/command-palette.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Sidebar, Header, RouterOutlet, ToastComponent, LiquidGlassComponent, CommandPaletteComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  constructor(private theme: ThemeService) {}
}

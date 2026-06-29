import { Directive, ElementRef, HostListener, Renderer2, OnInit, OnDestroy, Input } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Directive({
  selector: '[lgInteractive]',
  standalone: true
})
export class LiquidGlassDirective implements OnInit, OnDestroy {

  private bubble!: HTMLElement;
  private rafId = 0;
  private isGlass = false;
  private themeUnsub?: () => void;
  private lastX = 0;
  private lastY = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private theme: ThemeService
  ) {}

  ngOnInit() {
    this.isGlass = this.theme.currentTheme() === 'glass';
    // Watch theme changes
    const effect = () => { this.isGlass = this.theme.currentTheme() === 'glass'; };
    // Angular signal effect - poll for changes
    const interval = setInterval(effect, 300);
    this.themeUnsub = () => clearInterval(interval);

    // Create the bubble element
    this.bubble = this.renderer.createElement('div');
    this.renderer.setStyle(this.bubble, 'position', 'absolute');
    this.renderer.setStyle(this.bubble, 'border-radius', '50%');
    this.renderer.setStyle(this.bubble, 'pointer-events', 'none');
    this.renderer.setStyle(this.bubble, 'opacity', '0');
    this.renderer.setStyle(this.bubble, 'width', '0px');
    this.renderer.setStyle(this.bubble, 'height', '0px');
    this.renderer.setStyle(this.bubble, 'transform', 'translate(-50%, -50%)');
    this.renderer.setStyle(this.bubble, 'transition',
      'width 0.45s cubic-bezier(0.34,1.3,0.64,1), height 0.45s cubic-bezier(0.34,1.3,0.64,1), opacity 0.3s ease'
    );
    this.renderer.setStyle(this.bubble, 'z-index', '0');
    this.renderer.setStyle(this.bubble, 'mix-blend-mode', 'overlay');
    this.renderer.addClass(this.bubble, 'lg-bubble');

    // Ensure host is positioned
    const pos = window.getComputedStyle(this.el.nativeElement).position;
    if (pos === 'static') {
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    }
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
    this.renderer.appendChild(this.el.nativeElement, this.bubble);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isGlass) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.lastX = x; this.lastY = y;
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => this.updateBubble(x, y, rect));
  }

  private updateBubble(x: number, y: number, rect: DOMRect) {
    const size = Math.max(rect.width, rect.height) * 1.4;
    this.renderer.setStyle(this.bubble, 'left', `${x}px`);
    this.renderer.setStyle(this.bubble, 'top', `${y}px`);
    this.renderer.setStyle(this.bubble, 'width', `${size}px`);
    this.renderer.setStyle(this.bubble, 'height', `${size}px`);
    this.renderer.setStyle(this.bubble, 'opacity', '1');

    // Dynamic light direction — highlight moves with cursor
    const nx = (x / rect.width) * 100;
    const ny = (y / rect.height) * 100;
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI);
    this.renderer.setStyle(this.bubble, 'background',
      `radial-gradient(circle at ${nx}% ${ny}%, 
        rgba(255,255,255,0.55) 0%, 
        rgba(255,255,255,0.2) 35%, 
        rgba(200,210,255,0.1) 60%, 
        transparent 80%)`
    );
  }

  @HostListener('mouseenter', ['$event'])
  onEnter(e: MouseEvent) {
    if (!this.isGlass) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.updateBubble(x, y, rect);

    // Specular rim on the host element
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow',
      `inset 0 1px 0 rgba(255,255,255,0.95), 
       inset 0 0 0 1px rgba(255,255,255,0.5),
       0 8px 32px rgba(79,110,247,0.18)`
    );
    this.renderer.setStyle(this.el.nativeElement, 'transition',
      'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.34,1.3,0.64,1)'
    );
  }

  @HostListener('mouseleave')
  onLeave() {
    if (!this.isGlass) return;
    this.renderer.setStyle(this.bubble, 'opacity', '0');
    this.renderer.setStyle(this.bubble, 'width', '0px');
    this.renderer.setStyle(this.bubble, 'height', '0px');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }

  @HostListener('mousedown')
  onPress() {
    if (!this.isGlass) return;
    // Glass compression on press
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(0.97)');
    this.renderer.setStyle(this.el.nativeElement, 'filter', 'brightness(0.95)');
  }

  @HostListener('mouseup')
  onRelease() {
    if (!this.isGlass) return;
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.removeStyle(this.el.nativeElement, 'filter');
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    this.themeUnsub?.();
    if (this.bubble?.parentNode) this.bubble.parentNode.removeChild(this.bubble);
  }
}

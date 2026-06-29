import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-liquid-glass',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="isGlass">
      <!-- Global cursor light orb that follows mouse -->
      <div class="cursor-light"
        [style.left.px]="cursorX"
        [style.top.px]="cursorY"
        [style.opacity]="lightOpacity">
      </div>
      <!-- SVG filter definitions for optical distortion -->
      <svg class="lg-filters" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Refraction distortion filter -->
          <filter id="lg-refract" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025"
              numOctaves="3" seed="2" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feDisplacementMap in="SourceGraphic" in2="grayNoise"
              scale="6" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <!-- Subtle warp on glass surfaces -->
          <filter id="lg-warp" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="turbulence" baseFrequency="0.008 0.012"
              numOctaves="2" seed="5" result="warp">
              <animate attributeName="baseFrequency"
                dur="20s" repeatCount="indefinite"
                values="0.008 0.012;0.012 0.008;0.008 0.012"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="warp"
              scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <!-- Chromatic aberration on focus -->
          <filter id="lg-chroma">
            <feColorMatrix type="matrix"
              values="1 0 0 0 0.005  0 1 0 0 0  0 0 1 0 -0.005  0 0 0 1 0"/>
          </filter>
          <!-- Inner glow / depth -->
          <filter id="lg-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
      </svg>
    </ng-container>
  `,
  styles: [`
    :host { pointer-events: none; }

    .cursor-light {
      position: fixed;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
      transition: opacity 0.4s ease;
      background: radial-gradient(circle,
        rgba(180,200,255,0.14) 0%,
        rgba(150,180,255,0.08) 40%,
        transparent 70%);
      mix-blend-mode: screen;
      will-change: transform;
    }

    .lg-filters {
      position: fixed;
      width: 0; height: 0;
      overflow: hidden;
      pointer-events: none;
    }
  `]
})
export class LiquidGlassComponent implements OnInit, OnDestroy {

  cursorX = -500;
  cursorY = -500;
  lightOpacity = 0;
  isGlass = false;
  private rafId = 0;
  private targetX = -500;
  private targetY = -500;
  private interval: any;

  constructor(private theme: ThemeService) {}

  ngOnInit() {
    this.isGlass = this.theme.currentTheme() === 'glass';
    this.interval = setInterval(() => {
      this.isGlass = this.theme.currentTheme() === 'glass';
    }, 200);
    this.animateCursor();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    this.lightOpacity = 1;
  }

  @HostListener('document:mouseleave')
  onMouseLeave() { this.lightOpacity = 0; }

  // Smooth cursor following with lerp
  private animateCursor() {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      if (this.isGlass) {
        this.cursorX = lerp(this.cursorX, this.targetX, 0.1);
        this.cursorY = lerp(this.cursorY, this.targetY, 0.1);
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    clearInterval(this.interval);
  }
}

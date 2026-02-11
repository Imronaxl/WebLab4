import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { PointService } from '../../services/point.service';
import { PointResult } from '../../models/point.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [`.h-full { height: 100%; }`]
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  xOptions = [
    { label: '-2', value: -2 }, { label: '-1.5', value: -1.5 }, { label: '-1', value: -1 },
    { label: '-0.5', value: -0.5 }, { label: '0', value: 0 }, { label: '0.5', value: 0.5 },
    { label: '1', value: 1 }, { label: '1.5', value: 1.5 }, { label: '2', value: 2 }
  ];
  
  rOptions = [
    { label: '0.5', value: 0.5 }, { label: '1', value: 1 },
    { label: '1.5', value: 1.5 }, { label: '2', value: 2 }
  ];
  
  selectedX: number | null = null;
  yValue = '';
  selectedR: number | null = 1;
  yError = false;
  points: PointResult[] = [];

  /** Размер canvas в пикселях (обязательно задать для отрисовки графика и точек). */
  canvasSize = 500;
  
  private ctx!: CanvasRenderingContext2D;
  private readonly canvasWidth = 500;
  private readonly canvasHeight = 500;
  private readonly centerX = 250;
  private readonly centerY = 250;
  private readonly scale = 40;
  
  constructor(
    private authService: AuthService,
    private pointService: PointService,
    private router: Router,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void { this.loadPoints(); }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.initCanvas();
      requestAnimationFrame(() => this.drawGraph());
    });
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize')
  onResize(): void { this.drawGraph(); }

  private initCanvas(): void {
    if (!this.canvasRef?.nativeElement) return;
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const w = this.canvasSize || 500;
    canvas.width = w;
    canvas.height = w;
    const ctx = canvas.getContext('2d');
    if (ctx) this.ctx = ctx;
  }
  
  validateY(): void {
    const value = parseFloat(this.yValue);
    this.yError = isNaN(value) || value < -5 || value > 3;
  }
  
  onRadiusChange(): void {
    this.drawGraph();
    this.loadPoints();
  }
  
  checkPoint(): void {
    if (this.yError || this.selectedX === null || this.selectedR === null) {
      this.messageService.add({ severity: 'warn', summary: 'Предупреждение', detail: 'Заполните все поля корректно' });
      return;
    }
    
    const y = parseFloat(this.yValue);
    this.pointService.addPoint({ x: this.selectedX, y: y, r: this.selectedR }).subscribe({
      next: (result) => {
        this.points.unshift(result);
        this.drawGraph();
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: `Точка (${this.selectedX}, ${y.toFixed(2)}) проверена` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при проверке точки' });
      }
    });
  }
  
  onCanvasClick(event: MouseEvent): void {
    if (!this.selectedR) {
      this.messageService.add({ severity: 'warn', summary: 'Предупреждение', detail: 'Сначала выберите радиус R' });
      return;
    }
    
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const graphX = (clickX - this.centerX) / this.scale;
    const graphY = (this.centerY - clickY) / this.scale;
    
    const roundedX = this.findNearestX(graphX);
    const clampedY = Math.max(-5, Math.min(3, graphY));
    const roundedY = Math.round(clampedY * 2) / 2;
    
    this.selectedX = roundedX;
    this.yValue = roundedY.toFixed(2);
    this.validateY();
    if (!this.yError) {
      this.checkPoint();
    }
  }
  
  loadPoints(): void {
    this.pointService.getPoints().subscribe({
      next: (points) => {
        this.points = Array.isArray(points) ? points : [];
        this.drawGraph();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при загрузке точек' });
      }
    });
  }
  
  clearPoints(): void {
    this.pointService.clearPoints().subscribe({
      next: () => {
        this.points = [];
        this.drawGraph();
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Таблица очищена' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка при очистке таблицы' });
      }
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  private drawGraph(): void {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawGrid();
    this.drawAxes();
    if (this.selectedR) this.drawArea(this.selectedR);
    this.drawPoints();
  }
  
  private drawGrid(): void {
    this.ctx.strokeStyle = '#e5e7eb';
    this.ctx.lineWidth = 1;
    
    for (let i = -5; i <= 5; i++) {
      const x = this.centerX + i * this.scale;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvasHeight);
      this.ctx.stroke();
    }
    
    for (let i = -6; i <= 4; i++) {
      const y = this.centerY - i * this.scale;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvasWidth, y);
      this.ctx.stroke();
    }
  }
  
  private drawAxes(): void {
    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.centerY);
    this.ctx.lineTo(this.canvasWidth, this.centerY);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, 0);
    this.ctx.lineTo(this.centerX, this.canvasHeight);
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#374151';
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth - 10, this.centerY);
    this.ctx.lineTo(this.canvasWidth - 20, this.centerY - 5);
    this.ctx.lineTo(this.canvasWidth - 20, this.centerY + 5);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, 10);
    this.ctx.lineTo(this.centerX - 5, 20);
    this.ctx.lineTo(this.centerX + 5, 20);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#374151';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('X', this.canvasWidth - 20, this.centerY + 25);
    this.ctx.fillText('Y', this.centerX + 20, 15);
    
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      const x = this.centerX + i * this.scale;
      this.ctx.fillText(i.toString(), x, this.centerY + 20);
    }
    
    for (let i = -6; i <= 4; i++) {
      if (i === 0) continue;
      const y = this.centerY - i * this.scale;
      this.ctx.fillText(i.toString(), this.centerX - 20, y);
    }
    
    this.ctx.fillText('0', this.centerX - 20, this.centerY + 20);
  }
  
  private drawArea(r: number): void {
    const scaledR = r * this.scale;
    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.arc(this.centerX, this.centerY, scaledR / 2, -Math.PI / 2, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.lineTo(this.centerX - scaledR, this.centerY);
    this.ctx.lineTo(this.centerX, this.centerY - scaledR / 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.rect(this.centerX - scaledR / 2, this.centerY, scaledR / 2, scaledR);
    this.ctx.fill();
    this.ctx.stroke();
  }
  
  private drawPoints(): void {
    const currentR = this.selectedR != null ? Number(this.selectedR) : null;
    this.points.forEach(point => {
      const pointR = Number(point.r);
      if (currentR != null && Math.abs(pointR - currentR) > 1e-6) return;
      const px = this.centerX + Number(point.x) * this.scale;
      const py = this.centerY - Number(point.y) * this.scale;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = point.hit ? '#22c55e' : '#ef4444';
      this.ctx.strokeStyle = point.hit ? '#16a34a' : '#dc2626';
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();
    });
  }
  
  private findNearestX(value: number): number {
    const values = this.xOptions.map(o => o.value);
    let closest = values[0];
    let minDiff = Math.abs(value - closest);
    for (const v of values) {
      const diff = Math.abs(value - v);
      if (diff < minDiff) {
        minDiff = diff;
        closest = v;
      }
    }
    return closest;
  }
}

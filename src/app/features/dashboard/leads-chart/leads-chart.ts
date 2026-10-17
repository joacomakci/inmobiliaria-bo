import { Component, computed, input } from '@angular/core';
import { LeadsByDay } from '../../../core/models/dashboard.model';

const WIDTH = 600;
const HEIGHT = 190;

@Component({
  selector: 'app-leads-chart',
  templateUrl: './leads-chart.html',
  styleUrl: './leads-chart.scss',
})
export class LeadsChart {
  data = input.required<LeadsByDay[]>();

  readonly total = computed(() => this.data().reduce((sum, d) => sum + d.count, 0));

  // El eje Y siempre tiene 5 marcas enteras (0, N/4, N/2, 3N/4, N)
  readonly maxY = computed(() => {
    const max = Math.max(...this.data().map((d) => d.count), 0);
    return Math.max(4, Math.ceil(max / 4) * 4);
  });

  readonly yTicks = computed(() => {
    const step = this.maxY() / 4;
    return [4, 3, 2, 1, 0].map((i) => i * step);
  });

  private readonly points = computed(() => {
    const data = this.data();
    const last = Math.max(data.length - 1, 1);
    return data.map((d, i) => ({
      x: (i / last) * WIDTH,
      y: HEIGHT - (d.count / this.maxY()) * HEIGHT,
    }));
  });

  readonly linePath = computed(() =>
    this.points()
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' '),
  );

  readonly areaPath = computed(() => `${this.linePath()} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`);

  readonly xLabels = computed(() => {
    const data = this.data();
    if (data.length === 0) return [];
    const last = data.length - 1;

    return [0, 1, 2, 3, 4].map((i) => {
      const date = new Date(`${data[Math.round((i * last) / 4)].date}T00:00:00`);
      return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    });
  });
}
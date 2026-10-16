import { Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-stat-card',
  imports: [LucideDynamicIcon],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<LucideIconInput>();
  hint = input('');
}
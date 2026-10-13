import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCard } from '../../../../../interfaces/stats/stats-card.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, FaIconComponent],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent {
  @Input() data!: StatsCard;
}
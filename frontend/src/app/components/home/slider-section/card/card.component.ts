import { Component, input } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { CardModel } from "../../../../interfaces/card.model";
@Component({
  selector: "app-card",
  imports: [NgOptimizedImage],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
})
export class CardComponent {
  public cardData = input.required<CardModel>();
}

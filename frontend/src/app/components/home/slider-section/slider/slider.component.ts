import { Component, computed, signal } from "@angular/core";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from "../card/card.component";
import { CardModel } from "../../../../interfaces/card.model";

@Component({
  selector: "app-slider",
  imports: [CardComponent, FontAwesomeModule],
  templateUrl: "./slider.component.html",
  styleUrl: "./slider.component.scss",
})
export class SliderComponent {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  
  public activeIndex = signal<number>(0);
  public cards = signal<CardModel[]>([
    {
      imageFileName: "landing_scroll_one.webp",
      title: "compromiso",
      subtitle: "el anillo de la promesa",
      description:
        "María y Juan diseñaron juntos su anillo de compromiso, grabando sus iniciales en el interior.",
      alt: "Pareja feliz, mostrando con enfásis un anillo.",
    },
    {
      imageFileName: "family_rings.webp",
      title: "familia",
      subtitle: "herencia familiar",
      description:
        "Tres generaciones de mujeres forjaron mucho más que anillos: crearon símbolos vivos de amor, carácter y memoria.",
      alt: "Caja aterciopelada con diversos anillos.",
    },
    {
      imageFileName: "friends_rings.webp",
      title: "amistad",
      subtitle: "Amistad eterna",
      description:
        "Dos amigas diseñaron anillos a juego para sellar su amistad de por vida.",
      alt: "Amigas riendo, cada una de ellas con un anillo.",
    },
    {
      imageFileName: "landing_scroll_one.webp",
      title: "compromiso",
      subtitle: "el anillo de la promesa",
      description:
        "María y Juan diseñaron juntos su anillo de compromiso, grabando sus iniciales en el interior.",
      alt: "Pareja feliz, mostrando con enfásis un anillo.",
    },
    {
      imageFileName: "landing_scroll_two.webp",
      title: "familia",
      subtitle: "herencia familiar",
      description:
        "Tres generaciones de mujeres en una familia crearon sus propios anillos, cada uno único.",
      alt: "Caja aterciopelada con diversos anillos.",
    },
    {
      imageFileName: "landing_scroll_three.webp",
      title: "amistad",
      subtitle: "Amistad eterna",
      description:
        "Tres amigas diseñaron anillos a juego para sellar su amistad de por vida.",
      alt: "Amigas chocando los puños con, cada una de ellas con diversos anillos.",
    },
  ]);

  public readonly visibleCards = computed<CardModel[]>(() => {
    const first = this.activeIndex() % this.cards().length;
    const second = (this.activeIndex() + 1) % this.cards().length;
    const third = (this.activeIndex() + 2) % this.cards().length;
    return [this.cards()[first], this.cards()[second], this.cards()[third]];
  });

  public readonly transform = computed(() => {
    const offset = this.activeIndex() * -20;
    return `translateX(${offset}rem)`;
  });

  public previous(): void {
    const total = this.cards().length;
    this.activeIndex.update((value) => {
      const isAtStart = value - 1 < 0;
      const factor = isAtStart ? 2 : 0;
      const newIndex = (value - 1 + total) % total;
      return newIndex - factor;
    });
  }

  public next(): void {
    const total = this.cards().length;
    const factor = 2;
    this.activeIndex.update((value) => {
      const newIndex = (value + 1) % (total - factor);
      return newIndex;
    });
  }
}

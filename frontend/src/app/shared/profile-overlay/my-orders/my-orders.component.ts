import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from '@angular/common';
import { AccordionItemComponent } from "../../accordion-item/accordion-item.component";
import { InputComponent } from "../../input/input.component";
import { Order } from '../../../interfaces/order.interface';

import { OrderService } from '../../../services/order.service';
import { JewelService } from '../../../services/jewel.service';

import { AuthSrcDirective } from '../../../directives/auth-src.directive';

type OrderState = "inCart" | "ordered" | "delivered";

const ORDER_STATES_MAP: Record<OrderState, { label: string; class: string }> = {
  inCart: { label: "En el carrito", class: "state-cart" },
  ordered: { label: "Confirmado", class: "state-ordered" },
  delivered: { label: "Entregado", class: "state-delivered" },
};

@Component({
  selector: 'app-my-orders',
  imports: [AccordionItemComponent, FontAwesomeModule, InputComponent, DatePipe, AuthSrcDirective, CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent {
  faSliders = faSliders;
  
  jewelService = inject(JewelService);
  orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  private readonly statesMap = ORDER_STATES_MAP;

  private loadData = effect(() => {
    this.orderService
      .getMyOrders()
      .subscribe((res: any) => {
        if (res.result === 'OK' && res.orders && Array.isArray(res.orders.orders)) {
          this.orders.set(res.orders.orders);
        } else {
          this.orders.set([]);
        }
      });
  });

  getVariantName(prod: any): string {
    const variantId =
      prod.composition.variant?.$oid || prod.composition.variant;
    const base = prod.composition.baseStructure;

    if (!base || !base.profiles || !variantId) return "Estándar";

    for (const p of base.profiles) {
      const foundVariant = p.variants?.find(
        (v: any) => (v._id?.$oid || v._id).toString() === variantId.toString(),
      );
      if (foundVariant) return foundVariant.name;
    }

    return "Personalizado";
  }

  getClawInfo(settingGroup: any): string {
    const masterSetting = settingGroup.setting;
    if (!masterSetting || !settingGroup.clawNumber) return "";

    const claw = masterSetting.clawNumber.find(
      (c: any) => c._id.toString() === settingGroup.clawNumber.toString(),
    );
    return claw ? claw.name : "";
  }

  protected getStateInfo(state: string) {
    const key = state as OrderState;
    return this.statesMap[key] || { label: state, class: "" };
  }
}

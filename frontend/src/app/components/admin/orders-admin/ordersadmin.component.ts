import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { StatsSidebarComponent } from "../stats-sidebar/stats-sidebar.component";
import { OrderCardComponent } from "../../../shared/order-card/order-card.component";
import { CustomInputComponent } from "../../../shared/custom-input/custom-input.component";
import { OrderService } from "../../../services/order.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

/* =========================
   Interfaces
========================= */

interface User {
  _id: { $oid: string };
  name: string;
  surname: string;
  [key: string]: any;
}

interface Order {
  _id: string;
  user: User;
  [key: string]: any;
}

/* =========================
   Component
========================= */

@Component({
  selector: "app-ordersadmin",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputComponent,
    StatsSidebarComponent,
    OrderCardComponent,
  ],
  templateUrl: "./ordersadmin.component.html",
  styleUrls: ["./ordersadmin.component.scss"],
})
export class OrdersAdminComponent implements OnInit {
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private initialValues = {
    username: "",
    fromDate: "",
    toDate: "",
    status: "",
    minTotal: "",
    maxTotal: "",
    sort: "",
    page: 1,
    limit: 20,
    order: "asc",
  };

  /* =========================
     Derived Structures
  ========================== */

  public orderSelectorForm = this.fb.nonNullable.group({
    username: "",
    fromDate: "",
    toDate: "",
    status: "",
    minTotal: ["", Validators.min(0)],
    maxTotal: ["", Validators.min(0)],
    sort: "",
    page: 1,
    limit: 20,
    order: "asc",
  });
  public orders = signal<Order[]>([]);
  public totalPages = signal(1);

  /* =========================
     Private Helpers
  ========================== */

  ngOnInit(): void {
    this.orderSelectorForm.controls.minTotal.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value !== null && value !== "" && Number(value) < 0) {
          this.orderSelectorForm.controls.minTotal.setValue("", {
            emitEvent: false,
          });
        }
      });

    this.orderSelectorForm.controls.maxTotal.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (value !== null && value !== "" && Number(value) < 0) {
          this.orderSelectorForm.controls.maxTotal.setValue("", {
            emitEvent: false,
          });
        }
      });

    this.onSubmit();
  }

  private parseMongo(value: any): number {
    return parseFloat(value?.$numberDecimal ?? value ?? 0);
  }

  private cleanQuery<T extends Record<string, any>>(query: T): T {
    const result = {} as T;
    for (const key in query) {
      result[key] = (query[key] ?? "") as T[typeof key];
    }
    return result;
  }

  private mapOrders(orders: Order[]): Order[] {
    return orders.map((order) => {
      order["totalPrice"] = this.parseMongo(order["totalPrice"]);
      return order;
    });
  }

  /* =========================
     Public Methods
  ========================== */

  public nextPage() {
    const page = this.orderSelectorForm.controls.page.value || 1;
    const totalPages = this.totalPages();
    if (page < totalPages) {
      this.orderSelectorForm.controls.page.setValue(page + 1);
      this.onSubmit();
    }
  }

  public prevPage() {
    const page = this.orderSelectorForm.controls.page.value || 1;
    if (page > 1) {
      this.orderSelectorForm.controls.page.setValue(page - 1);
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    const query = this.cleanQuery(this.orderSelectorForm.value);
    this.orderService
      .getOrders(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res?.orders) {
          this.orders.set(this.mapOrders(res.orders.orders));
          const totalPages = Math.ceil(res.orders.total / query.limit!);
          this.totalPages.set(totalPages);
        } else {
          this.orders.set([]);
          this.totalPages.set(1);
        }
      });
  }

  public onReset(): void {
    this.orderSelectorForm.setValue(this.initialValues);
    this.onSubmit();
  }
}

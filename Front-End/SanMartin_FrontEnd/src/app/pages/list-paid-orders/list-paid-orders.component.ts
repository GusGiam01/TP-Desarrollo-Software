import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api/api.service';

@Component({
  selector: 'app-list-paid-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-paid-orders.component.html',
  styleUrl: './list-paid-orders.component.scss',
})
export class ListPaidOrdersComponent {
  constructor(private api: ApiService, private router: Router) {}

  private productCache = new Map<string, any>();

  @ViewChild('slider', { static: false }) slider?: ElementRef<HTMLElement>;

  loading = false;
  errorMsg = '';

  paidOrders: any[] = [];
  patchingById: Record<string, boolean> = {};

  ngOnInit(): void {
    this.getPaidOrders();
  }

  isAddressId(addr: any): boolean {
    return typeof addr === 'string';
  }

  isAddressObject(addr: any): boolean {
    return !!addr && typeof addr === 'object';
  }

  private isPaid(order: any): boolean {
    const hist: any[] = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
    if (!hist.length) return false;

    const last = String(hist[hist.length - 1] ?? '').toUpperCase();
    return last === 'PAID';
  }

  private orderId(order: any): string {
    return String(order?.id ?? order?._id ?? '');
  }

  private lines(order: any): any[] {
    const l = order?.linesOrder;
    if (!l) return [];
    if (Array.isArray(l)) return l;
    if (Array.isArray(l?.items)) return l.items;
    return [];
  }

  getPaidOrders(): void {
    this.loading = true;
    this.errorMsg = '';

    // La ApiService actual trae todas, acá filtramos por último estado "PAID". Se deberia hacer el filtro en el backend.
    this.api.searchOrders().subscribe({
      next: (resp: any) => {
        const all = Array.isArray(resp?.data) ? resp.data : [];
        this.paidOrders = all.filter((o: any) => this.isPaid(o));
        this.loading = false;

        // Recuperar las linesOrder de cada orden para mostrarlas en la card.
        this.paidOrders.forEach((order) => {
          const id = this.orderId(order);
          if (!id) return;
          this.api.searchLinesOrderByOrderId(id).subscribe({
            next: (respLines: any) => {
              const raw = respLines?.data;
              const lines = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : []);
              order.linesOrder = lines;

              // Recuperar productos (con cache)
              lines.forEach((line: any) => {
                const prod = line?.product;
                const prodId = typeof prod === 'string' ? prod : (prod?.id ?? prod?._id);
                if (!prodId) return;

                const cached = this.productCache.get(prodId);
                if (cached) {
                  line.product = cached;
                  return;
                }

                this.api.searchProductById(prodId).subscribe({
                  next: (respProd: any) => {
                    const p = respProd?.data;
                    if (!p) return;
                    this.productCache.set(prodId, p);
                    line.product = p;
                  },
                  error: (e) => console.log(e)
                });
              });
            },
            error: (e) => {
              console.log(e);
              // No es un error crítico, solo no se mostrarán las líneas de esa orden
            }
          });
        });
        
        // Recuperar las addresses de cada orden para mostrarlas en la card.
        this.paidOrders.forEach((order) => {
          const addr = order?.address;

          if (!addr) return;
          if (typeof addr !== 'string') return; // ya está poblada como objeto

          this.api.searchAddressById(addr).subscribe({
            next: (respAddr: any) => {
              order.address = respAddr?.data ?? null;
            },
            error: (e) => {
              console.log(e);
              // No es un error crítico, solo no se mostrará la dirección de esa orden
            }
          });
        });
      },
      error: (e) => {
        console.log(e);
        this.errorMsg = 'No se pudieron cargar las órdenes.';
        this.loading = false;
      },
    });
  }

  // Slider controls
  scrollLeft(): void {
    const el = this.slider?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: -(el.clientWidth * 0.9), behavior: 'smooth' });
  }

  scrollRight(): void {
    const el = this.slider?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' });
  }

  // PATCH: agregamos un estado nuevo a statusHistory
  markOnItsWay(order: any): void {
    const id = this.orderId(order);
    if (!id) return;

    if (this.patchingById[id]) return;

    const currentHistory: any[] = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
    const nextStatus = "On it's way";

    // Evitar duplicado si ya está
    const already = currentHistory.some((s) => String(s).toUpperCase() === nextStatus.toUpperCase());
    if (already) {
      // si ya está en camino, lo sacamos de la lista de "pagas"
      this.paidOrders = this.paidOrders.filter((o) => this.orderId(o) !== id);
      return;
    }

    const updatedHistory = [...currentHistory, nextStatus];

    this.patchingById[id] = true;
    this.errorMsg = '';

    // Tu ApiService tiene patchOrder(orderPatchI). Mandamos solo lo mínimo.
    this.api.patchOrder({ id, statusHistory: updatedHistory } as any).subscribe({
      next: () => {
        // Como "pagas" = último estado PAID, al agregar "On it's way" desaparece de esta pantalla
        this.paidOrders = this.paidOrders.filter((o) => this.orderId(o) !== id);
        this.patchingById[id] = false;
      },
      error: (e) => {
        console.log(e);
        this.errorMsg = 'No se pudo actualizar el estado de la orden.';
        this.patchingById[id] = false;
      },
    });
  }

  trackByOrderId = (_: number, order: any) => this.orderId(order);

  goBack(): void {
    window.history.back();
  }

  // Helpers para render
  lineTitle(line: any): string {
    const qty = line?.quantity ?? 0;

    const product = line?.product;
    const name =
      typeof product === 'string'
        ? product
        : (product?.name ?? product?.title ?? product?.id ?? 'Producto');

    return `${qty} x ${name}`;
  }

  addressLine(order: any): string {
    const a = order?.address;

    if (!a) return 'Sin dirección';
    if (typeof a === 'string') return `Dirección: ${a}`;

    const nickname = a?.nickname ? `${a.nickname} • ` : '';
    const addr = a?.address ?? '';
    const prov = a?.province ? `, ${a.province}` : '';
    const zip = a?.zipCode ? ` (${a.zipCode})` : '';

    const out = `${nickname}${addr}${prov}${zip}`.trim();
    return out || 'Sin dirección';
  }

  orderMeta(order: any): string {
    const id = this.orderId(order);
    const short = id ? `#${id.slice(-6)}` : '#—';
    const total = order?.totalAmount != null ? `$${order.totalAmount}` : '';
    return [short, total].filter(Boolean).join(' • ');
  }

  orderLines(order: any): any[] {
    return this.lines(order);
  }
}

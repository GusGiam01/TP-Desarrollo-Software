import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription, timer, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

type OrderStatus =
  | 'PAID'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'CANCELLED'
  | string
  | null;

type MpResult = 'success' | 'pending' | 'failure' | null;

interface OrderPaymentStatusResponse {
  orderId: string;
  statusHistory: string[];
  mpPaymentId?: string | null;
  paidAt?: string | null;
  total?: number | null;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  //private readonly API_BASE = 'http://localhost:3000';
  private readonly API_BASE = 'https://unfrictional-marisol-nongrounding.ngrok-free.dev';
  private readonly POLL_INTERVAL_MS = 3000;
  private readonly POLL_MAX_MS = 60000;

  orderId: string | null = null;
  mpResult: MpResult = null;

  loading = true;
  errorMsg: string | null = null;

  data: OrderPaymentStatusResponse | null = null;

  private pollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  get currentStatus(): OrderStatus {
    const history = this.data?.statusHistory;
    if (!Array.isArray(history) || history.length === 0) return null;
    return history[history.length - 1];
  }

  ngOnInit(): void {
    const qp = this.route.snapshot.queryParamMap.get('orderId');
    const rp = this.route.snapshot.paramMap.get('orderId');
    this.orderId = qp ?? rp;

    const mp = this.route.snapshot.queryParamMap.get('mpResult');
    this.mpResult = this.normalizeMpResult(mp);

    // Limpiar carrito si el pago fue exitoso
    if (this.mpResult === 'success') {
      localStorage.removeItem('orderId');
    }

    if (!this.orderId) {
      this.loading = false;
      this.errorMsg = 'Falta el orderId en la URL.';
      return;
    }

    this.fetchOnce(true);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private normalizeMpResult(raw: string | null): MpResult {
    if (!raw) return null;
    const s = raw.toLowerCase();

    if (s === 'success' || s === 'approved') return 'success';
    if (s === 'pending' || s === 'in_process' || s === 'inprocess') return 'pending';
    if (
      s === 'failure' ||
      s === 'fail' ||
      s === 'rejected' ||
      s === 'cancelled' ||
      s === 'canceled'
    ) {
      return 'failure';
    }
    return null;
  }

  mpThemeClass(): string {
    if (this.mpResult === 'success') return 'theme--success';
    if (this.mpResult === 'pending') return 'theme--pending';
    if (this.mpResult === 'failure') return 'theme--failure';
    return '';
  }

  mpBannerTitle(): string {
    if (this.mpResult === 'success') return 'Mercado Pago: pago aprobado';
    if (this.mpResult === 'pending') return 'Mercado Pago: pago pendiente';
    if (this.mpResult === 'failure') return 'Mercado Pago: pago rechazado';
    return '';
  }

  mpBannerMessage(): string {
    const backendStatus = this.currentStatus
      ? String(this.currentStatus).toUpperCase()
      : null;

    if (this.mpResult === 'success') {
      // MP puede devolverte a success antes de que llegue el webhook
      if (backendStatus && backendStatus !== 'PAID') {
        return 'Estamos confirmando la orden en nuestro sistema. Puede tardar unos segundos.';
      }
      return 'Volviste desde Mercado Pago con un pago aprobado.';
    }

    if (this.mpResult === 'pending') {
      return 'El pago aún no se confirmó. Vamos a seguir consultando el estado automáticamente.';
    }

    if (this.mpResult === 'failure') {
      return 'El pago no se completó. Podés reintentar o elegir otro medio de pago.';
    }

    return '';
  }

  // ========= API + polling =========
  fetchOnce(startPollingIfPending = false): void {
    if (!this.orderId) return;

    this.loading = true;
    this.errorMsg = null;

    this.http
      .get<OrderPaymentStatusResponse>(
        `${this.API_BASE}/api/mercadopago/orders/${encodeURIComponent(
          this.orderId
        )}/status`
      )
      .pipe(
        catchError((err) => {
          const msg =
            err?.error?.error ||
            err?.message ||
            'No se pudo obtener el estado del pago.';
          this.errorMsg = msg;
          this.data = null;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((resp) => {
        if (!resp) return;

        this.data = resp;
        this.loading = false;

        if (startPollingIfPending && this.isPendingLike(this.currentStatus)) {
          this.startPolling();
        } else {
          this.stopPolling();
        }
      });
  }

  startPolling(): void {
    if (!this.orderId) return;
    if (this.pollSub) return;

    const start = Date.now();

    this.pollSub = timer(0, this.POLL_INTERVAL_MS)
      .pipe(
        switchMap(() =>
          this.http
            .get<OrderPaymentStatusResponse>(
              `${this.API_BASE}/api/mercadopago/orders/${encodeURIComponent(
                this.orderId!
              )}/status`
            )
            .pipe(catchError(() => of(null)))
        )
      )
      .subscribe((resp) => {
        if (Date.now() - start > this.POLL_MAX_MS) {
          this.stopPolling();
          return;
        }

        if (!resp) return;

        this.data = resp;

        if (!this.isPendingLike(this.currentStatus)) {
          this.stopPolling();
        }
      });
  }

  stopPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = undefined;
    }
  }

  onRetry(): void {
    this.stopPolling();
    this.fetchOnce(true);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  // ========= UI helpers (estado real en backend) =========
  isPendingLike(status: OrderStatus): boolean {
    if (!status) return true;
    const s = String(status).toUpperCase();
    return s === 'PENDING_PAYMENT' || s === 'PENDING' || s === 'IN_PROCESS';
  }

  statusTitle(status: OrderStatus): string {
    if (!status) return 'Procesando pago';
    const s = String(status).toUpperCase();
    if (s === 'PAID') return 'Pago aprobado';
    if (s === 'PENDING_PAYMENT' || s === 'PENDING' || s === 'IN_PROCESS')
      return 'Pago pendiente';
    if (s === 'PAYMENT_FAILED' || s === 'REJECTED')
      return 'Pago rechazado';
    if (s === 'CANCELLED') return 'Pago cancelado';
    return `Estado: ${status}`;
  }

  statusMessage(status: OrderStatus): string {
    if (!status) return 'Estamos esperando confirmación de Mercado Pago.';
    const s = String(status).toUpperCase();
    if (s === 'PAID') return 'Tu orden fue confirmada. Ya podés continuar.';
    if (s === 'PENDING_PAYMENT' || s === 'PENDING' || s === 'IN_PROCESS')
      return 'Aún no se confirmó el pago. Esto puede tardar unos segundos.';
    if (s === 'PAYMENT_FAILED' || s === 'REJECTED')
      return 'El pago no se pudo completar. Podés reintentar o elegir otro medio de pago.';
    if (s === 'CANCELLED') return 'La operación fue cancelada.';
    return 'Consultá el estado o reintentá en unos segundos.';
  }

  statusBadgeClass(status: OrderStatus): string {
    if (!status) return 'badge badge--pending';
    const s = String(status).toUpperCase();
    if (s === 'PAID') return 'badge badge--ok';
    if (s === 'PENDING_PAYMENT' || s === 'PENDING' || s === 'IN_PROCESS')
      return 'badge badge--pending';
    if (s === 'PAYMENT_FAILED' || s === 'REJECTED') return 'badge badge--fail';
    if (s === 'CANCELLED') return 'badge badge--fail';
    return 'badge badge--neutral';
  }

  formatMoneyARS(value: number | null | undefined): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatDate(iso: string | null | undefined): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('es-AR');
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-commitpay',
  templateUrl: './commitpay.page.html',
  styleUrls: ['./commitpay.page.scss'],
})
export class CommitpayPage implements OnInit {

  showOptions: boolean = false;
  transactionDetail: any;
  errorMessage: string = '';
  token_ws: string = '';
  idCita: number = 0;
  idPaciente: number = 0;
  login: boolean = false;
  idPaciente2: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      //this.token_ws = params['token_ws'];
      let parametros = this.router.getCurrentNavigation();
      if (parametros?.extras.state) {
        this.token_ws = parametros?.extras.state['token_ws'];
      }
      this.idCita = JSON.parse(localStorage.getItem('idCita') || '0');
      this.idPaciente = JSON.parse(localStorage.getItem('idPaciente') || '0');
      this.login = JSON.parse(localStorage.getItem('login') || 'false');
      console.log(this.idCita)
      console.log(this.idPaciente)
      if (this.token_ws) {
        this.apiService.commitTransaction(this.token_ws).subscribe(
          (response) => {
            console.log("Pago Correcto")
            if (response.status === 'AUTHORIZED' && response.response_code === 0) {
              this.transactionDetail = {
                card_number: response.card_detail.card_number,
                transaction_date: new Date(response.transaction_date).toLocaleString(),
                state: response.status === 'AUTHORIZED' ? 'Aceptado' : 'Rechazado',
                pay_type: this.getPaymentType(response.payment_type_code),
                amount: this.formatAmount(response.amount),
                authorization_code: response.authorization_code,
                buy_order: response.buy_order,
              };
              this.apiService.confirmarCita(this.idPaciente, 1,this.idCita).subscribe(
                response => {
                  console.log('Cita Agendada Correctamente', response);
                },
                error => {
                  console.error('Error al agendar la cita', error);
                }
              );
              this.reloadOnce();
            } else {
              this.errorMessage = 'ERROR EN LA TRANSACCIÓN, SE RECHAZA LA TRANSACCIÓN.';
            }
          },
          (error) => {
            this.errorMessage = 'ERROR EN LA TRANSACCIÓN, SE CANCELO EL PAGO.';
          }
        );
      } else {
        this.errorMessage = 'ERROR EN LA TRANSACCIÓN, SE CANCELO EL PAGO.';
      }
    });
  }

  reloadOnce() {
    // Verifica si la página ya ha sido recargada
    const reloaded = localStorage.getItem('pageReloaded');

    if (!reloaded) {
      // Si no ha sido recargada, recargarla y establecer la bandera en el almacenamiento local
      localStorage.setItem('pageReloaded', 'true');
      location.reload();
    } else {
      // Si ya ha sido recargada, eliminar la bandera
      localStorage.removeItem('pageReloaded');
    }
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }


  goHome() {
    console.log("Login: ", this.login)
    console.log("IdPaciente: ", this.idPaciente)
    if (this.login) {
      let parametros: NavigationExtras = {
        state: {
          login: this.login,
          idPaciente: this.idPaciente
        },
        replaceUrl: true
      }
      this.router.navigate(['cliente'], parametros);
    } else {
      let parametros: NavigationExtras = {
        replaceUrl: true
      }
      this.router.navigate(['home'], parametros);
    }
  }

  private getPaymentType(code: string): string {
    switch (code) {
      case 'VD':
        return 'Tarjeta de Débito';
      // Agrega otros casos según sea necesario
      default:
        return 'Desconocido';
    }
  }

  private formatAmount(amount: number): string {
    return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }


}

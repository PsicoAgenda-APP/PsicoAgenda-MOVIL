import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { InAppBrowser } from '@capgo/inappbrowser';

import { Browser } from '@capacitor/browser';
import { Platform } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

  selectedDate: string = '';
  fechaFinal: string = '';
  availableTimes: any[] = [];
  showOptions: boolean = false;
  titulo: boolean = false;
  horas: boolean = false;
  idPsicologoString: string = '';
  idPsicologo: number = 0;
  idCita: string = '';
  lista_respuesta: any[] = [];
  validadorHora: number = 1;
  botonPago: boolean = false;
  monto: number = 0;
  idPaciente: number = 0;
  login: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private platform: Platform,
  ) { }

  async ngOnInit() {
    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset() * 60000; // Obtén el desplazamiento en milisegundos
    this.selectedDate = new Date(currentDate.getTime() - offset).toISOString().slice(0, -1);
    let parametros = this.router.getCurrentNavigation();
    if (parametros?.extras.state) {
      this.idPsicologoString = parametros?.extras.state['idPsicologo'];
      this.idPsicologo = parseInt(this.idPsicologoString, 10);
      this.idPaciente = parametros?.extras.state['idPaciente'];
      this.login = parametros?.extras.state['login'];
      console.log('El ID del usuario es:', this.idPsicologo)
    }
    let data = this.apiService.datosPsicologo(this.idPsicologo);
    let respuesta = await lastValueFrom(data);
    let jsonTexto = JSON.stringify(respuesta);
    let json = JSON.parse(jsonTexto);
    for (let x = 0; x < json.length; x++) {
      this.lista_respuesta.push(json[x]);
      this.monto = this.lista_respuesta[x].ValorSesion;
      console.log(this.monto);
      console.log(this.lista_respuesta);
    }
  }

  formatDate(dateString: string) {
    const date = new Date(dateString);
    const fechaFormat = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
    this.fechaFinal = fechaFormat;
  }



  async loadAvailableTimes() {
    this.horas = false;
    this.availableTimes = [];
    this.titulo = false;
    console.log('Fecha seleccionada:', this.selectedDate);
    this.formatDate(this.selectedDate);
    console.log('Id Psicologo:', this.idPsicologo);
    console.log('Fecha formateada:', this.fechaFinal);

    if (this.selectedDate) {
      this.botonPago = false;
      let data = this.apiService.obtenerHoras(this.idPsicologo, this.fechaFinal);
      let respuesta = await lastValueFrom(data);
      console.log('Respuesta completa de la API:', respuesta);

      // Asegurarse de que la respuesta es un array
      if (Array.isArray(respuesta)) {
        if (respuesta.length === 0) {
          this.horas = true;
          console.log('No hay horas disponibles.');
        } else {
          this.titulo = true;  // Asumimos que hay datos válidos
          respuesta.forEach(hora => {
            this.availableTimes.push(hora);
            console.log('Hora disponible:', hora);
          });
          // Verificar si hay al menos un elemento para tomar el IdCita
          if (this.availableTimes.length > 0) {
            this.validadorHora = this.availableTimes[0].IdCita;
          }
        }
      } else {
        console.log('Respuesta no es un arreglo. Revisar el formato de los datos recibidos de la API.');
      }
    }
  }

  scheduleAppointment(time: string) {
    console.log('Cita agendada para', this.selectedDate, 'a las', time);
    // Agrega aquí lógica adicional para confirmar la cita o interactuar con una API
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }


  goHome() {
    let parametros: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['home'], parametros);
  }

  confirmarCita(index: number) {
    const elemento = document.getElementById('id_cita_' + index);
    const idCitaString = elemento ? elemento.textContent : null;
    const idCita = parseInt(idCitaString!, 10);
    this.idCita = idCita.toString();
    console.log(this.idCita);
    this.botonPago = true;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async webpay_plus_create(): Promise<void> {
    this.loading = true;
    console.log("Webpay Plus Transaction.create");
    const buyOrder: string = this.getRandomInt(1000000, 99999999).toString();
    const sessionId: string = this.getRandomInt(1000000, 99999999).toString();
    console.log(buyOrder);
    console.log(sessionId);

    const returnUrl = `${window.location.origin}/commitpay`;

    this.apiService.createTransaction(buyOrder, sessionId, this.monto, returnUrl).subscribe(
      async (response) => {
        console.log('Transaction response:', response);
        if (response.token && response.url) {
          localStorage.setItem('idCita', JSON.stringify(this.idCita));
          localStorage.setItem('idPaciente', JSON.stringify(this.idPaciente));
          localStorage.setItem('login', JSON.stringify(this.login));

          await InAppBrowser.openWebView ({ url: `${response.url}?token_ws=${response.token}` });

          // Aquí es donde se invoca el listener
          InAppBrowser.addListener('urlChangeEvent', async (event: any) => {
            console.log('URL Changed:', event.url);
            if (event.url.includes(returnUrl || 'https://localhost/')) {
              await InAppBrowser.close();
              const token_ws = new URL(event.url).searchParams.get('token_ws');
              setTimeout(() => {
                let parametros: NavigationExtras = {
                  state: {
                    token_ws: token_ws
                  },
                  replaceUrl: true
                }
                this.router.navigate(['/commitpay'], parametros );
              }, 1500);
            }
          });

        } else {
          console.error('Error creating transaction');
        }
      },
      (error) => {
        console.error('Error creating transaction', error);
      }
    );
  }

}

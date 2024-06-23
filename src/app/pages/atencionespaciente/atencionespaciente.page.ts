import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-atencionespaciente',
  templateUrl: './atencionespaciente.page.html',
  styleUrls: ['./atencionespaciente.page.scss'],
})
export class AtencionespacientePage implements OnInit {

  login: boolean = false;
  idTipo: number = 0;
  idUsuario: number = 0;
  idPersona: number = 0;
  idPaciente: number = 0;
  correo: string = '';
  showProximaCitaEmptyMessage: boolean = false;
  showHistorialCitasEmptyMessage: boolean = false;
  loading: boolean = false;
  historialCitas: any[] = [];
  isAlertOpen = false;
  alertButtons = ['OK'];
  error_mensaje: any = '';

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    let parametros = this.router.getCurrentNavigation();
    if (parametros?.extras.state) {
      this.idTipo = parametros?.extras.state['idTipo'];
      this.idPaciente = parametros?.extras.state['idPaciente'];
      this.idUsuario = parametros?.extras.state['idUsuario'];
      this.login = parametros?.extras.state['login'];
      this.correo = parametros?.extras.state['correo'];
      this.idPersona = parametros?.extras.state['idPersona'];
    }
    this.obtenerDetallesCitas();

  }

  async obtenerDetallesCitas() {
    const IdPaciente = this.idPaciente;
    try {
      const data = this.apiService.obtenerDetallesCitas(IdPaciente);
      const respuesta = await lastValueFrom(data);
      this.historialCitas = Array.isArray(respuesta) ? respuesta : [];
      if (this.historialCitas.length === 0) {
        this.showHistorialCitasEmptyMessage = true;
      } else {
        this.showHistorialCitasEmptyMessage = false;
      }
    } catch (error) {
      this.showHistorialCitasEmptyMessage = true;
      this.isAlertOpen = true;
      this.error_mensaje = 'Error al obtener detalles de citas';
      console.error('Error al obtener detalles de citas', error);
    }
  }

  goHome() {
    if (this.login) {
      let parametros: NavigationExtras = {
        state: {
          login: this.login,
          idPaciente: this.idPaciente,
          correo: this.correo,
          idUsuario: this.idUsuario,
          idTipo: this.idTipo,
          idPersona: this.idPersona
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

  goSoporte () {
    let parametros: NavigationExtras = {
      state: {
        login: this.login,
        idPaciente: this.idPaciente,
        correo: this.correo,
        idUsuario: this.idUsuario,
        idTipo: this.idTipo,
        idPersona: this.idPersona
      },
      replaceUrl: true
    }
    this.router.navigate(['soportepaciente'], parametros);
  }

  logout() {
    this.login = false;
    let parametros: NavigationExtras = {
      state: {
        login: this.login
      },
      replaceUrl: true
    }
    this.router.navigate(['home'], parametros);
  }

  goHistorial() {
    console.log('Login: ', this.login)
    let parametros: NavigationExtras = {
      state: {
        login: this.login,
        idPaciente: this.idPaciente,
        correo: this.correo,
        idUsuario: this.idUsuario,
        idTipo: this.idTipo,
        idPersona: this.idPersona
      },
      replaceUrl: true
    }
    this.router.navigate(['atencionespaciente'], parametros);
  }

  goEditar () {
    let parametros: NavigationExtras = {
      state: {
        login: this.login,
        idPaciente: this.idPaciente,
        correo: this.correo,
        idUsuario: this.idUsuario,
        idTipo: this.idTipo,
        idPersona: this.idPersona
      },
      replaceUrl: true
    }
    this.router.navigate(['editarpaciente'], parametros);
  }
}

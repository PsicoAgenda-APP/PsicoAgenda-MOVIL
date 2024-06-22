import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  login: boolean = false;
  idTipo: number = 0;
  idUsuario: number = 0;
  lista_respuesta: any[] = [];
  idPaciente: number = 0;
  proximaCita: any = {};
  error_mensaje: any = '';
  nombre_completo: string = '';
  nombre: string = '';


  constructor(private router: Router, private apiService: ApiService) { }

  async ngOnInit() {
    let parametros = this.router.getCurrentNavigation();
    if (parametros?.extras.state) {
      this.idTipo = parametros?.extras.state['idTipoUsuario'];
      this.idPaciente = parametros?.extras.state['idPaciente'];
      this.idUsuario = parametros?.extras.state['idUsuario'];
      this.login = parametros?.extras.state['login'];
      
    }
    let data = this.apiService.getId(this.idTipo, this.idUsuario);
    let respuesta = await lastValueFrom (data);
    let jsonTexto = JSON.stringify(respuesta);
    let json = JSON.parse(jsonTexto);
    for (let x = 0; x < json.length; x++) {
      this.lista_respuesta.push(json[x]);
      this.idPaciente = this.lista_respuesta[x].IdPaciente;
      console.log(this.idPaciente);
      }
      this.obtenerProximaCita();
    }
    

    async obtenerProximaCita() {
      const IdPaciente = this.idPaciente; // Reemplaza esto con el IdPaciente real
      try {
        const data = this.apiService.obtenerProximaCita(IdPaciente);
        const respuesta = await lastValueFrom(data);
        this.proximaCita = respuesta;
        this.nombre_completo = this.proximaCita.nombre_paciente;
        let nombres_separados = this.nombre_completo.split(" ");
        this.nombre = nombres_separados[0];
      } catch (error) {
        this.error_mensaje = 'Error al obtener la próxima cita';
        console.error('Error al obtener la próxima cita', error);
      }
    }

    buscar() {
      this.login = true;
      let parametros: NavigationExtras = {
        state: {
          login: this.login,
          idPaciente: this.idPaciente
        },
        replaceUrl: true
      }
      this.router.navigate(['busqueda'], parametros);

    }
}

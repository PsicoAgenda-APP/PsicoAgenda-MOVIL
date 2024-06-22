import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Usuario } from 'src/app/models/usuario.model';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  
  lista_persistencia: Usuario[] = [];
  IdUsuario: number = 0;
  validador = false;

  constructor(private dbService: DbService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.dbService.obtenerTodasLasSesiones().then(data => {
        for (let x = 0; x < data.length; x++) {
          this.lista_persistencia.push(data[x]);
        }
  
        for (let i = 0; i < this.lista_persistencia.length; i++) {
          if (this.lista_persistencia[i].Activo.toString().includes('1')) {
            this.validador = true;
            this.IdUsuario = this.lista_persistencia[i].IdUsuario;
          }
        }
  
        if (this.validador) {
          let parametros: NavigationExtras = {
            state: {
              user: this.IdUsuario
            },
            replaceUrl: true
          }
          this.router.navigate(['cliente'], parametros);
        } else {
          this.router.navigate(['home']);
        }
  
      });
    }, 3000);
  }

}



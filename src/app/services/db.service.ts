import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private sqlite: SQLite) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS Usuario (IdUsuario INTEGER , Activo INTEGER)', [])
          .then(() => console.log('FSR: TABLA CREADA OK'))
          .catch(e => console.log('FSR: ' + JSON.stringify(e)));
      }) 
      
      .catch(e => console.log('FSR: ' + JSON.stringify(e)));
  }

  obtenerTodasLasSesiones() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT IdUsuario, Activo FROM Usuario', [])
          .then((data) => {
            let lista_sesiones = [];

            for (let x = 0; x < data.rows.length; x++) {
              lista_sesiones.push(data.rows.item(x));
            }

            return lista_sesiones;
          })
          .catch(e => {
            return []
          });
      })
      .catch(e => {
        return []
      });
  }

  crearSesion(usuario: number, activo: number) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO Usuario (IdUsuario, Activo) VALUES (?, ?)', [usuario, activo])
        .then(() => console.log('FSR: SESION CREADA'))
        .catch(e => console.log('FSR: ' + JSON.stringify(e)));
      })
      .catch(e => console.log('FSR: ' + JSON.stringify(e))); 
  }

  actualizarSesion(activo: number, usuario: number) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('UPDATE SESION SET Activo = ? WHERE IdUsuario = ?', [activo, usuario])
        .then(() => console.log('FSR: SESION ACTUALIZADA'))
        .catch(e => console.log('FSR: ' + JSON.stringify(e)));
      })
      .catch(e => console.log('FSR: ' + JSON.stringify(e))); 
  }

}

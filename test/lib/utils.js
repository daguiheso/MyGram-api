'use strict'

import jwt from 'jsonwebtoken'

export default {
  /*
   * Metodos async para poderlos utilizar dentro de nuestro midlware async con async await
   *
   * Como utilizamos async await esperariamos que este modulo o toda esta logica retorne
   * una promesa, pero jwt tiene 2 trabaja de 2 formas: un metodo sincrono o uno asyncrono
   * pero que  retorna un callback, entonces hay una forma en la que puedo ejecutar una
   * funcion callback asyncrona como tal dentro de una promesa.
   */

  // Firmar un token, recibe payload (info del token), secret y options (config del token como algoritmo utilizado)
  async signToken(payload, secret, options) {
    /*
     * Creando promesa utilizando la clase Promise que viene por defecto en ecma6
     * y le pasamos una function anonima con 2 params:
     * - resolve: es la funcion que voy a ejecutar para resolver la promsea
     * - reject: es la funcion que voy a ejecutar si ocurre algun error
     */
    return new Promise((resolve, reject) => {
      // firmando token pasandole los params y esto me retorna un callback y qui puedo hacer resolve o reject de la promesa
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err)

        resolve(token)
      })
    })
  },

  async verifyToken (token, secret, options) {

  },
  // estraer token de la peticion http
  async extractToken (req) {

  }
}
'use strict'

import jwt from 'jsonwebtoken'
import bearer from 'token-extractor'

export default {
  /*
   * Metodos async para poderlos utilizar dentro de nuestro midlware async con async await
   *
   * Como utilizamos async await esperariamos que este modulo o toda esta logica retorne
   * una promesa, pero jwt tiene 2 trabaja de 2 formas: un metodo sincrono o uno asyncrono
   * pero que  retorna un callback, entonces hay una forma en la que puedo ejecutar una
   * funcion callback asyncrona como tal dentro de una promesa.
   *
   * Creando promesa utilizando la clase Promise que viene por defecto en ecma6
   * y le pasamos una function anonima con 2 params:
   *   - resolve: es la funcion que voy a ejecutar para resolver la promsea
   *   - reject: es la funcion que voy a ejecutar si ocurre algun error
   */

  // Firmar un token, recibe payload (info del token), secret y options (config del token como algoritmo utilizado)
  async signToken (payload, secret, options) {
    return new Promise((resolve, reject) => {
      // firmando token pasandole los params y esto me retorna la info en un callback y qui puedo hacer resolve o reject de la promesa
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err)

        resolve(token)
      })
    })
  },

  async verifyToken (token, secret, options) {
    return new Promise((resolve, reject) => {
      // nos retorna en un callback el payload decodificado
      jwt.verify(token, secret, options, (err, decoded) => {
        if (err) return reject(err)

        resolve(decoded)
      })
    })
  },

  /*
   * estraer token de la peticion http, asi que cogemos del request de los campos de
   * headers el token y vamos a parsearlo.
   *
   * ese header viene: 'Authorization: Bearer token'', entonces para no implementar todo
   * el parsing de esto, podemos utilizar un modulo llamado token extractor que se encargara
   * de extraer el token por nosotros, de validar que venga correctamente en el header
   */
  async extractToken (req) {
    return new Promise((resolve, reject) => {
      // bearer me pasa el token que extrae del request
      bearer(req, (err, token) => {
        if (err) return reject(err)

        resolve(token)
      })
    })
  }
}

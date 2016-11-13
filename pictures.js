'use strict'

// send me permite enviar respuestas en las  peticiones que nos hacen al servidor
// json me permite extraer el body del request
import { send, json } from 'micro'
import HttpHash from 'http-hash'
// la DB es una clase que importamos
import Db from 'MyGram-db'
import config from './config'
import DbStub from './test/stub/db'

// const env = process.env.NODE_ENV || 'production'
const env = 'test'

// instanciando clase Db
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

const hash = HttpHash()

/*
 * Set ruta, se puede como url o metodo y url. Asi que va GET / , le
 * pasamos un id y como handler le definimos una funcion async. Dado
 * que estamos utilizando micro queremos que las funciones sean
 * async para poder utilizar async await sin problema. Esto no lo
 * podemos hacer con express, a express no le puedo pasar una funcion
 * asincrona en el callback por que no va a saber como ejecutarla.
 */
hash.set('GET /:id', async function getPicture (req, res, params) {
  // obtenemos el id de los params de la ruta
  let id = params.id
  // conexion a la DB
  await db.connect()
  // obtenemos imagen
  let image = await db.getImage(id)
  // terminamos conexion a la DB
  await db.disconnect()
  // enviamos esa imagen dentro de la respuesta
  send(res, 200, image)
})

hash.set('POST /', async function postPicture (req, res, params) {
  // extrayendo el body - esperando a que me devuelva el obj json de la imagen
  let image = await json(req)
  await db.connect()
  let created = await db.saveImage(image)
  await db.disconnect()
  send(res, 201, created)
})

/*
 * micro espera que yo le exporte una funcion asyncrona para ya el
 * escucharla y empezar a servir.
 *
 * Exportando function por defecto que es asyncrona, la llamamos main
 * ya que es la principal y esta es la funcion que recibe los dos objetos
 * de req y res
 *
 * Aca en esta funcion se deben hacer toda la logica para verificar
 * cuando llega una peticion para la ruta a o b o c
 */
export default async function main (req, res) {
  /* logica para ejecutar ruta declarada */
  // let method = req.method
  // let url = req.url
  // object structuring ecma6
  let { method, url } = req
  // haciendo macth, con esto hash busca si hay alguna ruta en las declaradas que coincida con esta y nos retorna el objeto.
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  /*
   * La forma de saber si la ruta esta definida o no, es verificando si
   * el handler fue definido, el handler es la funcion que vamos a ejecutar
   * en todo el proceso de ejecucion.
   */
  if (match.handler) {
    // try catch forma de controlar errores al utilizar async await
    try {
      // ejecutar handler
      await match.handler(req, res, match.params)
    } catch (e) {
      // error de servidor y obtenido de e.message
      send(res, 500, { error: e.message })
    }
  } else {
    // en caso de no haber handler devolvemos codigo 404 y un objeto json con error
    send(res, 404, { error: 'route not found' })
  }
}

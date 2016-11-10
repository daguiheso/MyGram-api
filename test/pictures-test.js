'use strict'

import test from 'ava'
// importamos de micro a micro y el metodo send
import micro, { send } from 'micro'
import uuid from 'uuid-base62'
// para hacer testing de microservicios  con micro
import listen from 'test-listen'
// me permite hacer http request utilizando promesas
import request from 'request-promise'

test('GET /:id', async t => {
  let id = uuid.v4()
  // mock de microservicio corriendo

  /*
   * creando servidor utilizando micro, micro recibe un request listener, ese request listener es
   * como si yo se le estubiera pasando una funcion al create server del modulo http de node, pero
   * este request listener puede ser asincrono y es la gran ventaja de micro, y ademos lo que se
   * tenga de request listener podra ser escrito con async await.
   *
   * Luego enviamos la respuesto y para eso utilizamos la funcion send() de micro que es una utilidad
   * donde le pasamos la respuesta como argumento, status code y respuesta que voy a enviar, es un test
   * muy basico
   */
  let srv = micro(async (req, res) => {
    // send(res, 200, { id: id })
    send(res, 200, { id })
  })

  // listen me retorna una url y puerto del servidor creado, asi que listen corre el servidor durante el test

  // obtener ul, como listen retorna una promesa por eso el await
  let url = await listen(srv)
  // obtener body de request
  let body = await request({ uri: url, json: true })
  t.deepEqual(body, { id })
})

// tests pendientes
test.todo('POST /')
test.todo('POST /:id/like')

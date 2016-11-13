'use strict'

import test from 'ava'
import micro from 'micro'
// para hacer testing de microservicios  con micro
import listen from 'test-listen'
// me permite hacer http request utilizando promesas
import request from 'request-promise'
import fixtures from './fixtures/'
import pictures from '../pictures'

test('GET /:id', async t => {
  let image = fixtures.getImage()
   /*
   * creando servidor utilizando micro que es quien lanza el servidor,
   * micro recibe  lo que exporta micro y micro lo que exporta es una
   * function en pictures
   */
  let srv = micro(pictures)

  // listen me retorna una url y puerto del servidor que esta corriendo, asi que listen corre el servidor durante el test

  // obtener url, como listen retorna una promesa por eso el await
  let url = await listen(srv)
  // hacemos peticion http al microservicio y obtenemos body de request
  let body = await request({ uri: `${url}/${image.publicId}`, json: true })
  // validamos que objeto que retorna es igual a imagen creada
  t.deepEqual(body, image)
})

// tests pendientes
test.todo('POST /')
test.todo('POST /:id/like')

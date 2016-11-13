'use strict'

import test from 'ava'
import micro from 'micro'
// para hacer testing de microservicios  con micro
import listen from 'test-listen'
// me permite hacer http request utilizando promesas
import request from 'request-promise'
import fixtures from './fixtures/'
import pictures from '../pictures'
import utils from '../lib/utils'
import config from '../config'

test.beforeEach(async t => {
  /*
   * creando servidor utilizando micro que es quien lanza el servidor,
   * micro recibe  lo que exporta micro y micro lo que exporta es una
   * function en pictures
   */
  let srv = micro(pictures)

  /*
   * listen me retorna una url y puerto del servidor que esta corriendo, asi que listen
   * corre el servidor durante el test y retorna una promesa por eso el uso de await
   *
   * obtener url y añadirla al contexto, asi se podra obtener del context de c/u de los test
   */
  t.context.url = await listen(srv)
})

test('GET /:id', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  // hacemos peticion http al microservicio y obtenemos body de request
  let body = await request({ uri: `${url}/${image.publicId}`, json: true })
  // validamos que objeto que retorna es igual a imagen creada
  t.deepEqual(body, image)
})

test('secure POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  // creando token
  let token = await utils.signToken({ userId: image.userId }, config.secret)

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  // Ejecutar request con las opciones
  let response = await request(options)

  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

test('no token POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  // peticion http POST
  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true
  }

  // throws espera que lance una excepcion la promesa que le paso
  t.throws(request(options), /invalid token/)
})

test('invalid token POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  // creando token
  let token = await utils.signToken({ userId: 'hacky' }, config.secret)

  let options = {
    method: 'POST',
    uri: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    },
    resolveWithFullResponse: true
  }

  t.throws(request(options), /invalid token/)
})

test('POST /:id/like', async t => {
  let image = fixtures.getImage()
  let url = t.context.url

  let options = {
    method: 'POST',
    uri: `${url}/${image.publicId}/like`,
    json: true
  }

  let body = await request(options)
  /*
   * Metodo para hacer CLON de elementos en JS y consiste en volver la
   * imagen u obj a un string y luego volverlo a parsear. Pero no es muy
   * recomendado cuando tengo objetos muy grandes, en este caso no hay lio.
   */
  let imageNew = JSON.parse(JSON.stringify(image))

  imageNew.liked = true
  imageNew.likes = 1

  t.deepEqual(body, imageNew)
})

test('GET /list', async t => {
  let images = fixtures.getImages()
  let url = t.context.url

  let body = await request({ uri: `${url}/list`, json: true })
  t.deepEqual(body, images)
})

test('GET /tag/:tag', async t => {
  let images = fixtures.getImagesByTag()
  let url = t.context.url

  let body = await request({ uri: `${url}/tag/awesome`, json: true })
  t.deepEqual(body, images)
})

'use strict'

export default {
  getImage () {
    return {
      id: '916351e8-943e-4891-bd31-e7cd6100db76',
      publicId: '4uQq7w5I0KW3siqfDK5Mk44uQnNHnCxED8glslLmSGqO1pyYUw',
      userId: 'fercho',
      liked: false,
      likes: 0,
      url: 'http://mygram.test/4uQq7w5I0KW3siqfDK5Mk44uQnNHnCxED8glslLmSGqO1pyYUw.jpg',
      description: 'an #awesome picture',
      tags: [ 'awesome' ],
      createdAt: new Date().toString()
    }
  },
  getImages () {
    return [
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]
  },
  getImagesByTag () {
    return [
      this.getImage(),
      this.getImage()
    ]
  },
  getUser () {
    return {
      id: 's54-8uh-6sd',
      name: 'David Hernandez',
      username: 'daviheso',
      email: 'daviheso@gmail.test',
      password: 'ohmidios',
      createdAt: new Date().toString()
    }
  }
}

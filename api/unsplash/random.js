const { send } = require('micro')

require('isomorphic-fetch')
const { default: Unsplash, toJson } = require('unsplash-js')

const WALLPAPER_COLLECTION_ID = 136026

const client = new Unsplash({
  applicationId: process.env.UNSPLASH_ACCESS_KEY,
  secret: process.env.UNSPLASH_SECRET_KEY,
  callbackUrl: process.env.UNSPLASH_CALLBACK_URL
})

const parseImageResult = img => ({
  id: img.id,
  photographer: {
    name: img.user.name,
    profile_url: img.user.links.html
  },
  url: img.urls.small
})

const getRandomImages = () =>
  client.photos
    .getRandomPhoto({
      collections: [WALLPAPER_COLLECTION_ID],
      count: 20
    })
    .then(toJson)
    .then(imgs => imgs.map(parseImageResult))

module.exports = (req, res) =>
  getRandomImages()
    .then(imgs => send(res, 200, imgs))
    .catch(e => {
      // eslint-disable-next-line
      console.error(e)
      return send(res, 500)
    })
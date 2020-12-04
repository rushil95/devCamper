const nodeGeocoder = require("node-geocoder")

geocoderOptions = {
  provider : process.env.GEOCODER_PROVIDER,
  apiKey : process.env.GEOCODER_API_KEY
}

const geocoder = nodeGeocoder(geocoderOptions)
module.exports = geocoder
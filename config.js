module.exports = {
  database: process.env.DATABASE,
  port: process.env.PORT,
  secret: process.env.SECRET,
  AWS_accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AWS_secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  algolia_appId: process.env.ALGOLIA_APP_ID,
  algolia_apiKey: process.env.ALGOLIA_API_KEY,
  stripe_key: process.env.STRIPE_KEY
}
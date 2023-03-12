module.exports = ({ env }) => ({
  auth: {
    secret: env('API_TOKEN_SALT', 'someRandomLongString'),
  },
  apiToken: {
    salt: env('ADMIN_JWT_SECRET', 'someSecretKey'),
  },
  transfer: { 
    token: { 
      salt: env('TRANSFER_TOKEN_SALT', 'anotherRandomLongString'),
    } 
  },
});

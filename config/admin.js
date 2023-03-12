module.exports = ({ env }) => ({
  auth: {
    secret: env(process.env.ADMIN_JWT_SECRET),
  },
  apiToken: {
    salt: env(process.env.API_TOKEN_SALT),
  },
  transfer: {
    token: {
      salt: env(process.env.TRANSFER_TOKEN_SALT),
    },
  },
});

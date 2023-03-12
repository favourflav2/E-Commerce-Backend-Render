"use strict";
const stripe = require("stripe")(process.env.STRIPE_KEY);

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { cart } = ctx.request.body;

    const lineItems = await Promise.all(
      cart.map(async (item) => {
        const value = await strapi
          .service("api::product.product")
          .findOne(item.id);
        console.log(value);

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: value.title,
            },
            unit_amount: value.price * 100,
          },
          quantity: item.count,
        };
      })
    );
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        //customer_email:email,
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
        success_url: `https://strapi-9lib.onrender.com/success/?success=true`,
        cancel_url: `https://strapi-9lib.onrender.com/?canceled=true`,
        line_items: lineItems,
        payment_method_types: ["card"],
      });

      let croppedCart = cart?.map((item) => ({
        id: item.id,
        title: item.attributes.title,
        price: item.attributes.price,
        count: item.count,
      }));

      await strapi.service("api::order.order").create({
        data: {
          products: croppedCart,
          stripeSessionId: session.id,
          stripeId: session.id,
        },
      });

      return { id: session.id };
    } catch (e) {
      ctx.response.status = 500;
      console.log(e);
    }
  },
}));


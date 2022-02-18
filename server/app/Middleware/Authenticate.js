"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const { SiwsMessage } = require("siws");

class Authenticate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    // call next to advance the request
    const token = request.header("Authorization");
    if (!token) {
      response.status(403).send({ status: 403, message: "missing token" });
      return;
    }
    const siwsMessage = new SiwsMessage({}).decode(token);
    const validated = siwsMessage.validate();
    if (validated) {
      request.siwsMessage = siwsMessage;
      await next();
    } else {
      response.status(401).send({ status: 401, message: "invalid signature" });
    }
  }
}

module.exports = Authenticate;

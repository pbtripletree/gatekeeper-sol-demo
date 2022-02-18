"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { authorize } = require("gatekeeper-sol");
const { roles } = require("./roles.js");

class Authorize {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    const { siwsMessage } = request;
    const authorizeResponse = await authorize({
      request: siwsMessage,
      tokenRoles: roles,
    });
    if (authorizeResponse.success) {
      request.roles = authorizeResponse.roles;
      await next();
    } else {
      response
        .status(401)
        .send({ status: 401, message: authorizeResponse.message });
    }
  }
}

module.exports = Authorize;

"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { decode, authorize } = require("gatekeeper-sol");

const { roles } = require("./roles.js");

class ValidateSignature {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    // call next to advance the request
    try {
      const token = request.header("Authorization");
      if (!token) {
        response.status(403).send({ status: 403, message: "missing token" });
        return;
      }
      const decoded = decode(token);
      const { signature, address, message } = decoded;
      if (!signature || !address || !message) {
        response.status(403).send({ status: 403, message: "missing headers" });
        return;
      }
      const authorizeResponse = await authorize({
        request: {
          signature,
          message,
          address,
        },
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
    } catch (e) {
      console.log(e);
      response.status(500).send({ status: 500, message: e });
    }
  }
}

module.exports = ValidateSignature;

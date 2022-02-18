"use strict";

const content = require("./content.js");

class ContentController {
  async get({ request, response }) {
    const { roles } = request;
    const rolesContent = roles.map((role) => {
      const roleContent = content.content.find((c) => {
        return c.role === role;
      });
      return roleContent.content;
    });
    if (!rolesContent.length)
      response
        .status(200)
        .send({ status: 200, message: "no content for role" });
    else
      response
        .status(200)
        .send({ status: 200, message: "content found", data: rolesContent });
  }
}

module.exports = ContentController;

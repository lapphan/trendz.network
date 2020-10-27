const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async getId(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.channel.search(ctx.query);
    } else {
      entities = await strapi.services.channel.find(ctx.query);
    }

    var channels = entities.map(entity => sanitizeEntity(entity, { model: strapi.models.channel }));
    
    var result = [];

    channels.forEach( channel => {
        var channelId = { "id": channel.id}
        result.push(channelId);
    });

    return result;
  }
};

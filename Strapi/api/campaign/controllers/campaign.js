const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async getId(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.campaign.search(ctx.query);
    } else {
      entities = await strapi.services.campaign.find(ctx.query);
    }

    var campaigns = entities.map(entity => sanitizeEntity(entity, { model: strapi.models.campaign }));
    
    var result = [];

    campaigns.forEach( campaign => {
        var campaignId = { "id": campaign.id}
        result.push(campaignId);
    });

    return result;
  }
};
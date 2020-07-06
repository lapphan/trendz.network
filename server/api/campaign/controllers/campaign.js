const { parseMultipartData, sanitizeEntity } = require('strapi-utils');


module.exports = {
  async create(ctx) {
    let campaignEntity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      campaignEntity = await strapi.services.campaign.create(data, { files });
    } else {
        campaignEntity = await strapi.services.campaign.create(ctx.request.body);
    }

    campaignEntity = sanitizeEntity(campaignEntity, { model: strapi.models.campaign });

    
    await campaignEntity.channels.forEach(channel => {
            // let User = strapi.services.user.findOne({id: "5efc27fea306cf2f8878bf9d"});
            //channel.user = user id
        let User = strapi.services.users.findOne({ id: channel.user });
        strapi.plugins['email'].services.email.send({
            to: "supermido1996@gmail.com",
            from: 'noreply@trendz.network',
            subject: `New campaign`,
            text: `
                Email channel: ${User.email}
            `,
        });
    })

    return campaignEntity;
  },
};
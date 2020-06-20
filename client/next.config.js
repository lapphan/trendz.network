//const path = require('path')
require('dotenv').config()

const withCSS = require('@zeit/next-css')
const withFonts = require('next-fonts')
const withImages = require('next-images')

module.exports=withCSS(withFonts(withImages({
    webpack: function(config){
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: '[name].[ext]'
              }
            }
          })
          return config
    },
    env:{
        API_URL: process.env.API_URL
    },
    
})))
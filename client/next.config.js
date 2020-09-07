//const path = require('path')
require('dotenv').config();

const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withFonts = require('next-fonts');
const withImages = require('next-images');

module.exports = withCSS(
  withSass(
    withFonts(
      withImages({
        webpack: function (config) {
          config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 100000,
                name: '[name].[ext]',
              },
            },
          });
          return config;
        },
        env: {
          API_URL: process.env.API_URL,
        },
        exportPathMap: function () {
          return {
            '/': { page: '/' },
            '/dashboard': { page: '/dashboard' },
            '/create': { page: '/create' },
            '/login': { page: '/login' },
            '/register': { page: '/register' },
            '/profile': { page: '/profile' },
            '/create-channel': { page: '/create-channel' },
            '/404': { page: '/404' },
          };
        },
      })
    )
  )
);

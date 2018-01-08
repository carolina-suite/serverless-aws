
module.exports = {
  prerenderData: {},
  prerenderFiles: [
    {
      'in': '_carolina/app.pug',
      out: 'index.html',
      data: {
        bootswatchTheme: 'sketchy',
        jsFile: '/static/js/auth.js'
      }
    }
  ]
};

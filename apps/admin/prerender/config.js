
module.exports = {
  prerenderData: {},
  prerenderFiles: [
    {
      'in': '_carolina/spectre/app.pug',
      out: 'index.html',
      data: {
        cssFiles: [
          'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.33.0/codemirror.css'
        ],
        jsFile: '/static/js/admin.js'
      }
    }
  ]
};

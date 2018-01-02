
module.exports = {

  name: "Serverless App",
  slug: 'serverless',

  awsProfile: 'personal',
  awsRegion: 'us-west-2',

  mainMenu: [
    { title: 'Account', link: '/auth' },
    { title: 'Admin', link: '/admin' },
    {
      title: 'Social Networks',
      isDropdown: true,
      menu: [
        { title: 'Facebook', link: 'https://facebook.com/' },
        { title: 'Twitter', link: 'https://twitter.com' },
        { title: 'GitHub', link: 'https://github.com' }
      ]
    }
  ],

  apps: [
    'auth'
  ]
};

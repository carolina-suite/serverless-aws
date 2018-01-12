
module.exports = {

  name: "Serverless App",
  slug: 'serverless',

  awsProfile: 'personal',
  awsRegion: 'us-west-2',

  // your aws domain must be the domain, email wont work without this set up
  siteEmail: 'webmaster@johnfmarion.com',

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
    'admin',
    'auth',
    'docs_example'
  ]
};


# Docusaurus Projects #

Carolina Serverless works with
[Docusaurus](https://github.com/facebook/Docusaurus) as a static-site generator.

## Setup #

Follow these steps to have an app based on Docusuarus.

* Install docusaurus: `npm i -g docusaurus-init`.
* Create an app folder for a new app.
* Create another folder, `apps/appName/docusaurus/`
* Within that `docusaurus` folder, run `docusaurus-init`.
* Rename the docs examples folder to docs.
* Rename the website/blog-examples folder to blog.
* Edit the contents.
* In `siteConfig.js`, edit the baseUrl to be `/<appName>/`.
* In `siteConfig.js`, edit the projectName to be `<appName>`.
* The above two steps ensure that absolute links within the site will work.
* Run `npm run build` from the `docusaurus/website/` dir.
* The build folder will be copied to the public folder when you run `node build` from the main site.

NOTE: Do not have a `prerender/` folder and a `docusaurus/` folder within the
same app. This will cause conflicts. A docusaurus app should probably
function ONLY as a docusaurus app.

NOTE: When making Docusaurus apps, you will have to run the build process from
that `website` folder. The ONLY thing Carolina does is copy that entire
build folder into the public folder.


# Prerender Templates #

Prerender templates are [Pug Templates](https://pugjs.org/api/getting-started.html)
located in the app's `prerender/pug/` dir.

They will be used for generating public files when `node build` is run.

To specifiy the prerender job for your app, define a `prerender/config.js` file.
It should export an object with two keys:

* `prerenderData`: Data that will be passed as `prerenderData` to the pug process for all files in the job.
* `prerenderFiles`: A list of prerender orders, each with the following keys:
  * `in`: The pug template to use (ie, `home/index.pug`).
  * `out`: The file to be written to the app's public folder (ie, `index.html`).
  * `data`: An object to be passed as `localData` to the pug process for this specific file.

## Important Notes #

All pug templates will be copied over to the `.prerender/` directory for the
site. For example `apps/blog/prerender/pug/post.pug` will be copied to
`.prerender/blog/post.pug` (and would be referenced in a prerender config
as `blog/post.pug`). All pug includes and extensons should bear the
compile-time location in mind. This step facilitates including and
extending templates across apps.

Also note that files will be overwritten in the build process. For example,
if a prerender job for a "blog" app specifies an output to `index.html`,
the file `apps/blog/public/index.html` will be overwritten.

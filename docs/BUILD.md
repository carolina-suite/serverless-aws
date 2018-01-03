
# The Build Process #

The following steps are taken when you run `node build`

* The `.prerender/` dir is created if it doesn't exist.
* Prerender pug templates from all apps are copied to the `.prerender` dir.
* The prerender config files are read and executed, creating output files in app public dirs.
* All HTTP packages are zipped and placed in the app private dirs.

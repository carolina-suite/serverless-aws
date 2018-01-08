
# Private Files #

Put all private files that you want in your private S3 bucket in
`apps/<appName>/private/`. The folder is copied into the private bucket as
`<appName>/`.

While you can mostly structure the folder however you want,
keep the following guidance in mind:

* The `http/` dir is reserved for the ZIP files of your HTTP Lambda functions (automatically placed there when you run `node build`).
* The `svc/` dir is reserved for the ZIP files of your Service functions (automatically placed there when you run `node build`).
* The `heml/` dir is for HEML e-mail templates (the Carolina E-Mail Service will look for them there).
* Do not mess with the `apps/_carolina/private/` dir, it is special and houses
a variety of things including all of your site's model schemas.

View the [Carolina Lambda Docs](./C_LAMBDA.md) for more info on accessing
private files from your HTTP and Service Lambda functions.

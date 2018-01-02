
# Serverless Site Starter with AWS #

This is the planned "serverless-aws" template to be used by the
[Carolina CLI](https://github.com/carolina-suite/carolina-cli).

It is a starter template (currently under construction) for a website that
uses your Amazon Web Services for doing everything.

## Getting Started #

Use this repository as a starting point for sites using AWS for a
"serverless" architecture.

### Installation #

**Via Carolina**

Not yet implemented.

**Via Git**

`git clone https://github.com/carolina-suite/serverless-aws`

### Usage #

When ready, this template will should be ready to be run.

Before running, ensure that the slug value in `config/index.js`
is something helpful. If you change it later, you should also delete your
`.state` file and you will create new buckets for everything.

You must also have your AWS credentials set up, and reference the profile
you want to use in your configuration.

Run

`node deploy`

The plan is for this command to put everything in its place and wire it
all together. It should give you an S3 Bucket URL that you can go to
to see your site.

## Docs #

For more details, see the [docs](./docs/README.md).

# Acknowledgements #

### Authors #

* John F Marion

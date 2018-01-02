
# Configuration #

## Important Values #

The configuration should have the following values:

* `name`: The human-friendly name of your site.
* `slug`: The computer friendly name of your site. It will be used in many URLs.
* `awsProfile`: Which credential set to use from your `~/.aws/credentials` file.
* `awsRegion`: Which AWS region to set everything up in.
* `apps`: A list of app names. Each one should correspond to an app in your `apps/` directory.

Note that the `home` app should not be listed in `apps`.

## Optional Values #

* `mainMenu`: This is used by the partial prerender template `_carolina/navbar.pug`.


# Overview of Starter Site #

## The `_carolina` Dir #

This folder contains utility classes used for setting up and deploying the
site.

## The `apps/` Dir #

This where apps for the site go.

The special `home` app is the root. The `_carolina` app contains
utility functions and such.

As you edit the home app, you should be careful not to name any `public/` files
or folders in a way that matches the name of any other installed app.

All other apps are normal apps and you can add to them.

Apps should be entirely "pluggable" to make them shareable.


# Creating Apps #

Creating new apps is a simple process. Simply create a folder for it and then
register it in your config file.

The name of your app should be chosen carefully. If your app has a `public/`
folder, it will be mounted at `domain.com/{appName}/`.

Because many things are done in the home app and because the home app's
public dir is copied into the root of the public bucket, all app names should
avoid conflict with the names of any directories or files in the home
public folder. Avoid calling an app any of the following names:

* static
* js
* css
* config

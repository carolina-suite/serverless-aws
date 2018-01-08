
# App Structure #

The structure of an app is as follows:

```
appName/
  http/
    endpointName/  # Folder for an HTTP Lambda Function
      index.js
  models/          # All your models
    ModelName.yml  # Schema for a model
  prerender/
    pug/           # Prerender pug templates
    config.js      # Prerender configuration
  private/         # Private configuration files
  public/          # Public site files
    index.html     # The main page for your app.
  svc/
    ServiceName/   # Folder for a Service Lambda Function
      index.js
```

Note that all top-level folders are optional.

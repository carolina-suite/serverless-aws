
# Fixtures #

Fixtures are a tool for seeding your database. Some fixtures for starting
or example data belong with apps, whereas other fixtures belong to the
site as a whole.

## Fixture Placement #

Place site-wide fixtures *directly* in the `.fixtures/` dir. Note that
app fixtures will be copied into a subdirectory of `.fixtures`,
for example `.fixtures/auth/` for starting users. If you wish to alter those
files, you should do so in the `apps/appName/fixtures` directory or
make your own copies directly in `.fixtures/`.

## Fixture Format #

A fixture file should be a `.js` file that exports a list of objects in the
following format:

```js
module.exports = [
  {
    model: { app: '<appName>', model: '<modelName>' },
    fields: {
      '<fieldName>': '<fieldValue>',
      // etc
    }
  }
];
```

That data will be placed into the database in the appropriate tables when you
load it.

## Loading Fixtures #

Load a fixture into the database using the following command:

`node fixture <fixtureName>`

The first thing that happens when you run this command is that all fixtures
from apps are copied over into a subdirectory in the `.fixtures` directory.

For example, running `load fixture mydata` will load a fixture defined in
`.fixtures/mydata.js` and `load fixture auth/test-users` will load
`./fixtures/auth/test-users.js` which will have been copied over from
`apps/auth/fixtures/test-users.js`.

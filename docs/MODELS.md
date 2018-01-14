
# Model Schemas #

Model schemas go in the `apps/<appName>/models/` dir and are
name `<modelName>.yml`.

A schema looks like this:

```yml
modelName: User
keyField: username
adminFields:
  - username
  - emailAddress
  - isAdmin
fields:
  username:
    type: String
    required: true
    unique: true
  password:
    type: String
    secret: true
  salt:
    type: String
    secret: true
  name:
    type: String
  emailAddress:
    type: EmailAddress
    unique: true
  isAdmin:
    type: Boolean
    default: false
```

## Constraints #

The `modelName` must match the name of the file.

The `keyField` must be defined as a field of type "String" in `fields`.
It will be unique (whether specified as such or not).
It should also be a slug-friendly value in practice or funny
things may happen in the admin app.

The `adminFields` is optional but must a list of 1-4 fields that are
defined. These are the fields that will be shown in the summary
admin view.

## Commands #

You can list several commands in you schema. They look like this:

```yml

```

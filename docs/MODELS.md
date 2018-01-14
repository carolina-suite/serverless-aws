
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
# This example is from the built in User object
commands:
  - name: Set Password
    description: |
      Set the user's password to the provided value.
    fields:
      password:
        type: String
    execute:
      app: auth
      service: LoginService
      args:
        action: command-set-user-password
```

You can specify fields for the command (optional) in the same way
you specify actual database fields.

An admin user will see a card for each command when viewing an object of
this type in the admin panel.

When the user submits the command with its inputs, the specified backend
service will be called with the arguments listed under `args`, as well as
all the user inputs labeled as the fields are called, and a `src` attribute
defining the app, model, and keyField value of the current object.

In the above example, the Admin backend will look for a "LoginService"
in the "auth" application and call it with the following parameters:

```json
{
  "action": "command-set-user-password",
  "password": "<whatever the admin user typed>",
  "src": {
    "app": "auth",
    "model": "User",
    "value": "<username of current user being viewed>"
  }
}
```

As long as you have services set up to handle these commands (this one
  is already ready), it will be executable from the admin panel.

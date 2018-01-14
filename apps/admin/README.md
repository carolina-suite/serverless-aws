
# Admin App #

This is an admin app, providing an admin panel that administrator
users can use to manage site data and settings.

## Getting Started #

This app is included with the starter project, so no installation is
necessary.

The app is available at `/admin`.

It provides the following functionality:

* Allows admin users to view, edit, and delete objects of defined models.
* Allows admin users to execute defined custom commands against objects.

The app makes use of the `auth` app's User object in order to determine
what users are allowed to view the admin panel. It also makes use of
frontend servies of the `auth` app.

## Docs #

### Frontend Services #

#### Admin Library #

`import Admin from '../path/to/apps/admin/src/lib/Admin';`

**Creating a Starter Object from a Schema with Defined Files**

You can create a starter object based on a Carolina schema
(of the type used for Model Schemas or Custom Execution commands).

```js
var starterObject = Admin.getStarterObjectFromSchema(s);
```

The only part of the schema that is used and must be present is
`fields`.

### Reusable Components #

All components are designed to fit with Spectre.css.

#### FieldDisplay #

`import FieldDisplay from '../path/to/apps/admin/src/components/FieldDisplay';`

Displays a field from a defined schema in a table-friendly way.

Props:

* `field`: The definition of the field.
* `value`

```js
return (
  <td>
    <FieldDisplay field={fieldSchema} value={value} />
  </td>
)
```

Booleans are displayed as "TRUE" in green or "FALSE" in red.
E-Mail Addresses are displayed as "mailto" links.
Strings are displayed as strings.

#### FieldEdit #

`import FieldEdit from '../path/to/apps/admin/src/components/FieldEdit';`

Displays a horizontal-form friendly form-group for the schema and value.

Props:

* `schema`
* `value`
* `onChange`: Function will be called with `schema.name` and `currentValue`

```js
return (
  <form className="form-horizontal">
    <FieldEdit field={fieldSchema} value={value} onChange={changeHandler} />
  </form>
)
```

Booleans are presented as checkboxes.
EmailAddresses and Strings are presented as text inputs.

## Acknowledgements #

### Authors #

* John F Marion

### Built With #

* ReactJs

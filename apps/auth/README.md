

# Authentication App #

This is an authentication app for managing Users and allowing them to log in
to your site.

## Getting Started #

This app is included with the starter project, so no installation is necessary.

The app is available at `/auth`.

It provides the following functionality:

* User login
* Viewing and editing profile details
* Resetting password
* User registration

This app makes use of the Email Service defined by the site's configuration.

## Docs #

### Models #

#### User #

**Attributes**

| Attribute | Type | Description |
| --- | --- | --- |
| username | String | A unique username. |
| password | String | The salted and hashed password of the user. |
| salt | String | The salt for the current password. |
| email | String | The user's e-mail address. |
| name | String | The user's name. |
| isAdmin | Boolean | Whether or not the user has admin rights. |

### Fixtures #

#### Test Users #

`node fixture auth/test-users`

This adds several test users to the database, including an Admin Account
with the username "admin" and the password "admin123".

**Users**

| Username | Password |
| --- | --- |
| admin | admin123 |
| applejack | orange |
| fluttershy | yellow |
| pinkiePie | pink |
| rainbowDash | blue |
| rarity | white |
| twilightSparkle | purple |

### Email Templates #

#### Password Reset #

`auth/password-reset`

An e-mail template for e-mails resetting the user's password.

### API Endpoints #

This section describes API endpoints and their potential use by other apps.

#### Auth API #

`https://<apiDomain>/api/auth_api`

`Auth.callAPI("auth", "api", argsObject)`

**Check Current User Login Status**

```js
var isLoggedIn = await Auth.check();
// true if user is logged in
```

**Get Current User**

```js
var currentUser = await Auth.getUser();
// currentUser is an object representing current logged in user from the db
// the salt and password attributes are missing
```

### FrontEnd Services #

#### Auth Library #

`import Auth from '../path/to/apps/auth/src/lib/Auth';`

**Calling APIs**

You can call any API using the `Auth.callAPI` method. It will automatically
attach the token for the logged in user if it exists.

It returns a promise, resolving the response from the server. It does
not throw an error if the Lambda function fails,
so you should check for the existance

```js
var response = await Auth.callAPI('appName', 'apiName', {
  action: "whatever",
  // other args
});
```

**Check Current User Login Status**

```js
var isLoggedIn = await Auth.check();
// true if user is logged in
```

**Get Current User**

```js
var currentUser = await Auth.getUser();
// currentUser is an object representing current logged in user from the db
// the salt and password attributes are missing
```

## Acknowledgements #

### Authors #

* John F Marion

### Built With #

* Axios
* ReactJs

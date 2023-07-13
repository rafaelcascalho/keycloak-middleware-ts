# API

This is the documentation of the module API. Down below you'll find the modules functions and their usage explained.

## .jwt

This API consist of methods to verify a jwt access token online or offline with different strategies. It's accessible in the
keycloak context over the property `.jwt`.

### .verify

This methods verify the jwt received from the request. I has two built in strategies: offline verification, and verification via request
to keycloak. In both scenarios, if the verification is successful, it will parse the jwt to a new object with the token information.
This new object will enable you to check the request token information over function calls.

#### Offline verification

This is the preferred strategy if you want faster verifications. This strategy gets the Keycloak realm key and uses it to
try to decode a received jwt.

```js
try {
  // requestJwt - the access token received from the request
  const tokenInfo = await keycloak.jwt.verify(requestJwt)
} catch (error) {
  console.log(error)
}
```

#### Verification via request

This strategy simply executes a request to keycloak to verify the received jwt.

```js
// verification via request to keycloak
try {
  // requestJwt - the access token received from the request
  const verifyOffline = false
  const tokenInfo = await keycloak.jwt.verify(requestJwt, verifyOffline)
} catch (error) {
  console.log(error)
}
```

### Token info methods

The methods below are accessible after the use of both strategies.
How? Case the token is valid, which means its decodification was successful, then the jwt received is parsed to a new object.
So, same token, same parsing at the end, only real difference relied on the token verification strategy.

#### .isExpired

This method returns a boolean for the token expiration.

```js
  const tokenInfo = await keycloak.jwt.verify(requestJwt)
  if (parsedToken.isExpired())
    throw new Error('Expired Token')
```

#### .userId

This method returns a string with the user id in keycloak for that jwt.

```js
  const tokenInfo = await keycloak.jwt.verify(requestJwt)
  const id = tokenInfo.userId()
  console.log(id) // '123e4567-e89b-12d3-a456-426614174000'
```

#### hasAppRole

This method returns a boolean stating if the user has a specific app role or not.

```js
  const tokenInfo = await keycloak.jwt.verify(requestJwt)
  if (!parsedToken.hasAppRole('app_role_one'))
    console.log('This user do not have the app_role_one')
```

#### hasRealmRole

This method returns a boolean stating if the user has a specific app role or not.

```js
  const tokenInfo = await keycloak.jwt.verify(requestJwt)
  if (!parsedToken.hasRealmRole('realm_role_one'))
    console.log('This user do not have the realm_role_one')
```

## .accessToken

The **AccessToken** class defines methods to simplify retrieving tokens, refresh them and retrieving user info. The methods
of this class also were written to update the tokens case they're expired, which means, just use the methods, and they will
internally refresh themselves case they need it. It's accessible in the keycloak context over the property `.accessToken`.

### .info

This method retrieves the user info for the specific realm from keycloak. If the user access token is expired, it will be
refreshed before requesting the info again.

```js
// requestJwt - the access token received from the request
const userInfo = await keycloak.accessToken.info(requestJwt)
```

### .refresh

This method refreshes the user current access token. If the token refresh fails, another access token will be
requested from the keycloak server.

```js
// requestJwt - the access token received from the request
await keycloak.accessToken.refresh(requestJwt)
```

### .get

This method retrieves the a new access token for that specific realm user.

```js
try {
  // requestJwt - the access token received from the request
  const newAccessToken = await keycloak.accessToken.get(requestJwt)
} catch (error) {
  console.log(error)
}
```

## .users

The **UserManager** class define methods to simplify user management for simple use cases. It's accessible in the keycloak 
context over the property `.users`.

### .details

This method the user details from the realm in the keycloak server.

```js
try {
  // id - the user id
  const userDetails = await keycloak.users.details(id)
} catch (error) {
  console.log(error)
}
```

### .roles

This method returns the user roles for a given client.

```js
try {
  // id - the user id
  // clientsIds - the ids of the clients to retrieve that user roles for that client
  const clientsIds = ['backend_client']
  const userDetails = await keycloak.users.roles(id, clientsIds)
} catch (error) {
  console.log(error)
}
```

To include the realms roles it should be added a boolean as the last argument

```js
try {
  // id - the user id
  // clientsIds - the ids of the clients to retrieve that user roles for that client
  const clientsIds = ['backend_client']
  const includeRealmRoles = true
  const userDetails = await keycloak.users.roles(id, clientsIds, includeRealmRoles)
} catch (error) {
  console.log(error)
}
```

### .create

This method creates a user in the realm of the keycloak server.

```js
try {
  const user = {
    email: 'example@email.com',
    enabled: true,
    username: 'example',
    firstName: 'first',
    lastName: 'last',
    password: 'example_1234'
  }
  await keycloak.users.create(user)
} catch (error) {
  console.log(error)
}
```


### .getAttributes

This method returns the attributes of a given user

```js
try {
  const userId = 'example-id'
  const userAttributes = await keycloak.users.getAttributes(userId)
} catch (error) {
  console.log(error)
}
```


### .addAttributes

This method add new attributes for a given user

```js
try {
  const userId = 'example-id'
  const newUserAttributes: Attribute[] = [
  {key: 'country',
  value: ['mx']},
  {key: 'phone area code',
  value: ['+52']}
  ]
  
  await keycloak.users.addAttributes(userId, newUserAttributes)
} catch (error) {
  console.log(error)
}
```
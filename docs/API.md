# API

This is the documentation of the module API. Down below you'll find the modules functions and their usage explained.

## jwt

This API consist of methods to verify a jwt access token online or offline with different strategies.

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
  const tokenInfo = await keycloak.jwt.verify(requestJwt, false)
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

## AccessToken

### .info

### .refresh

### .get

## users

### .details

### .roles

### .create

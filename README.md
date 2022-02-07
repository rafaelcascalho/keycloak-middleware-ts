# keycloak-backend-ts

This is an TS implementation of the JS version of the [keycloak-backend npm package.](https://github.com/jkyberneees/keycloak-backend).

## Description

This module provides a minimal, simple to use and direct approach to enable backend integration with keycloak enabling most usual features
of authentication, token handling and user management. [Check more about keycloak here.](http://www.keycloak.org/)

## Quick Start

### Install Via NPM

```sh
npm install -S keycloak-backend-ts
```

### Set Up Your Keycloak Realm and Client For The Backend

It's necessary to have a realm and an active client correctly configured to be able to access all the features. [Check this guide to see how to do that.](https://medium.com/keycloak/keycloak-realm-client-configuration-dfd7c8583489)

### Usage

Just create a new keycloak context and use the methods of the lib API.

```js
// import the createKeycloakCtx method from the module
import createKeycloakCtx from "keycloak-backend-ts";

// create the keycloak context
const keycloak = createKeycloakCtx({
  realm: "realm name",
  authServerUrl: "keycloak server url",
  clientId: "client name",
  clientSecret: "client secret", // if required
  username: "service username",
  password: "service password",
  jwtKey: "realm public key", // optional
  jwtKeyAlgorithms: ["realm public key to decode JWT keys"], // optional
});

// use the created context easily
const accessToken = await keycloak.accessToken.get();
const tokenInfo = await keycloak.accessToken.info(accessToken);
const token = await keycloak.jwt.verify(accessToken);
if (token.isExpired()) throw new Error("your error message");
```

## Contributing

To contribute you can create issues or modify the code or docs yourself, and submit the PRs for new versions. If you're willing
to help beyound issues creation, just fork this repo, update the code or docs, create tests if some code were added, and submit the PR.
To make everything tight, first create and claim an issue. Then, just code it :smile:

### Installing Dependencies

```sh
npm install -D
```

### Tests

```sh
npm test
```

To generate coverage run the command below (this will be improved in the future).

```sh
npm run test:cov
```

## Next Steps

For the foreseeable future, these are the next steps:

- [  ] create pipelines to run the automated tests, static code analysis
- [  ] add pre commit step automation for tests, linting and formatting
- [  ] improve code coverage to enable threshold of 90-100%
- [  ] add tech stack

export interface KeycloakConfig {
  realm: string
  authServerUrl: string
  clientId: string
  clientSecret?: string
  username: string
  password: string
  jwtKey?: string
  jwtKeyAlgorithms?: Array<string>
}

export interface KeycloakTokenResponse {
  access_token: string
  refresh_token: string
}

export interface User {
  id?: string
  email: string
  enabled: boolean
  username: string
  firstName: string
  lastName: string
  password: string
}

export interface UpdateCredentialOptions {
  temporary?: boolean
}

export interface Headers {
  Authorization: string
}

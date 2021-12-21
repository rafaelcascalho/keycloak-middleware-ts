export interface KeycloakConfig {
  realm: string,
  auth_server_url: string,
  client_id: string,
  client_secret?: string,
  username: string,
  password: string,
  clients: string
}

export interface KeycloakTokenResponse {
  access_token: string
  refresh_token: string
}

export interface User {
  id: string
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

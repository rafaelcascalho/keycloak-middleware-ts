import Axios, { AxiosInstance } from 'axios'

import Jwt from './Jwt'
import UserManager from './UserManager'
import AccessToken from './AccessToken'
import { KeycloakConfig } from './interfaces'

function createKeycloakCtx(config: KeycloakConfig, request: AxiosInstance) {
  if (!request) request = Axios.create({ baseURL: config.auth_server_url })

  const accessToken = new AccessToken(config, request)
  const users = new UserManager(config, request, accessToken)
  const jwt = new Jwt(config, request)

  return { jwt, users, accessToken }
}

export default createKeycloakCtx

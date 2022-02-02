import Axios, { AxiosInstance } from 'axios'

import Jwt from './Jwt'
import UserManager from './UserManager'
import AccessToken from './AccessToken'
import { KeycloakConfig } from './interfaces'
import { KEY_END, KEY_START, DEFAULT_ALGORITHMS } from './constants'

export function validKeyStart(key: string) {
  return key.startsWith(KEY_START)
}

export function validKeyEnd(key: string) {
  return key.endsWith(KEY_END)
}

export function secureKeyFormat(key: string) {
  const validStart = validKeyStart(key)
  const validEnd = validKeyEnd(key)
  if (validStart && validEnd) return key

  if (!validStart && !validEnd)
    return `${KEY_START}\n${key}\n${KEY_END}`

  if (!validStart)
    return `${KEY_START}\n${key}`

  return `${key}\n${KEY_END}`
}

export default function createKeycloakCtx(config: KeycloakConfig, request?: AxiosInstance | any) {
  const { jwtKey, jwtKeyAlgorithms: algorithms } = config
  if (jwtKey) config.jwtKey = secureKeyFormat(jwtKey)

  if (!algorithms?.length) {
    config.jwtKeyAlgorithms = algorithms || DEFAULT_ALGORITHMS
  }

  if (!request) request = Axios.create({ baseURL: config.auth_server_url })

  const accessToken = new AccessToken(config, request)
  const users = new UserManager(config, request, accessToken)
  const jwt = new Jwt(config, request)

  return { jwt, users, accessToken }
}

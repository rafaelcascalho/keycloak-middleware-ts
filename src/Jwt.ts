import jwt from 'jsonwebtoken'
import { AxiosInstance } from 'axios'

import Token from './Token'
import { KeycloakConfig } from './interfaces'

const manyArgsPromisify = (fn: Function) => {
  return (...args: any) => {
    return Promise.resolve(fn(...args))
  }
}

const asyncVerify = manyArgsPromisify(jwt.verify)

class Jwt {
  private readonly config: any
  private readonly request: AxiosInstance

  constructor(config: KeycloakConfig, request: AxiosInstance | any) {
    this.config = config
    this.request = request
  }

  async verifyOffline(accessToken: string, cert: string, options = {}) {
    await asyncVerify(accessToken, cert, options)
    return new Token(accessToken)
  }

  async verify(accessToken: string) {
    const headers = { Authorization: `Bearer ${accessToken}` }
    const endpoint = `/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`
    await this.request.get(endpoint, { headers })

    return new Token(accessToken)
  }
}

export default Jwt

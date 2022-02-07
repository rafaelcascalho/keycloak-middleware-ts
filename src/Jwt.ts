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
  private readonly config: KeycloakConfig
  private readonly request: AxiosInstance

  constructor(config: KeycloakConfig, request: AxiosInstance | any) {
    this.config = config
    this.request = request
  }

  async verify(accessToken: string, offline=true) {
    if (offline) return this.verifyOffline(accessToken)

    return this.verifyViaRequest(accessToken)
  }

  private async verifyOffline(accessToken: string) {
    if (!this.config.jwtKey)
      throw new Error('Missing key to enable offline JWT verification')

    if (!this.config.jwtKeyAlgorithms)
      throw new Error('Missing key algorithms to enable offline JWT verification')

    const options = { algorithms: this.config.jwtKeyAlgorithms }
    await asyncVerify(accessToken, this.config.jwtKey, options)
    return new Token(accessToken)
  }

  private async verifyViaRequest(accessToken: string) {
    const headers = { Authorization: `Bearer ${accessToken}` }
    const endpoint = `/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`
    await this.request.get(endpoint, { headers })
    return new Token(accessToken)
  }
}

export default Jwt

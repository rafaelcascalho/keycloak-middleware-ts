import { AxiosInstance } from 'axios'

import { KeycloakTokenResponse } from './interfaces'
import { KeycloakConfig } from './interfaces'

class AccessToken {
  private accessToken: string
  private refreshToken: string
  private readonly config: any
  private readonly request: AxiosInstance
  private readonly baseUrl: string

  constructor(config: KeycloakConfig, request: AxiosInstance | any) {
    this.accessToken = ''
    this.refreshToken = ''
    this.config = config
    this.request = request
    this.baseUrl = `/auth/realms/${this.config.realm}`
  }

  async info(accessToken: string): Promise<any> {
    const headers = { Authorization: `Bearer ${accessToken}` }
    const endpoint = `${this.baseUrl}/protocol/openid-connect/userinfo`

    try {
      const response = await this.request.get(endpoint, { headers })
      return response?.data
    } catch (error) {
      await this.refresh(this.refreshToken)
      return this.info(this.accessToken)
    }
  }

  async refresh(refreshToken: string): Promise<any> {
    const requestParams = {
      grant_type: 'refresh_token',
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      refresh_token: refreshToken
    }
    const params = new URLSearchParams(requestParams).toString()
    const endpoint = `${this.baseUrl}/protocol/openid-connect/token`

    try {
      const response = await this.request.post(endpoint, params)
      this.resetTokens(response.data)
    } catch (error) {
      this.accessToken = ''
      this.get()
    }
  }

  async get(): Promise<string> {
    if (this.accessToken) {
      await this.info(this.accessToken)
      return this.accessToken
    }

    const requestParams = {
      grant_type: 'password',
      username: this.config.username,
      password: this.config.password,
      client_id: this.config.client_id,
      client_secret: this.config.client_secret
    }
    const params = new URLSearchParams(requestParams)
    const endpoint = `${this.baseUrl}/protocol/openid-connect/token`

    const response = await this.request.post(endpoint, params)
    this.resetTokens(response.data)
    return this.accessToken
  }

  private resetTokens({ access_token, refresh_token }: KeycloakTokenResponse): void {
    this.accessToken = access_token
    this.refreshToken = refresh_token
  }
}

export default AccessToken

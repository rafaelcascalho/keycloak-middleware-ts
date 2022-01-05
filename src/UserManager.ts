import { AxiosInstance, AxiosResponse } from 'axios'

import AccessToken from './AccessToken'
import { KeycloakConfig, User, UpdateCredentialOptions, Headers } from './interfaces'

class UserManager {
  private readonly baseUrl: string
  private readonly token: AccessToken
  private readonly config: KeycloakConfig
  private readonly request: AxiosInstance

  constructor(config: KeycloakConfig, request: AxiosInstance | any, token: AccessToken) {
    this.config = config
    this.request = request
    this.token = token
    this.baseUrl = `/auth/admin/realms/${this.config.realm}/users`
  }

  async details(id: string) {
    const headers = await this.mountHeaders()

    const url = `${this.baseUrl}/${id}`
    const response = await this.request.get(url, { headers })

    return response?.data
  }

  async roles(id: string, clientsIds: Array<string> = [], includeRealmRoles = false) {
    const promises = []
    const headers = await this.mountHeaders()

    const realmRolesUrl = `${this.baseUrl}/${id}/role-mappings/realm/composite`

    // retrieve roles from each target client
    promises.push(...this.stackUpGetClientRolesRequests(id, clientsIds, headers))

    // retrieve roles from realm
    if (includeRealmRoles) {
      promises.push(this.request.get(realmRolesUrl, { headers }))
    }

    return this.batchAndParseRolesPromises(promises)
  }

  async create(user: User) {
    const endpoint = this.baseUrl
    const headers = await this.mountHeaders()

    await this.request.post(endpoint, user, { headers })
    await Promise.allSettled([
      this.savePassword(user.id, user.password, headers),
      this.verifyEmail(user.id, headers)
    ])
  }

  // IMPROVE: the any types used in this function need to be replaced by a declared interface
  private async batchAndParseRolesPromises(promises: Array<Promise<AxiosResponse<any>>>) {
    const batchResponses = await Promise.allSettled(promises)
    const successes = batchResponses.filter(this.filterFulfilledResults)
    return successes.length ?
      successes :
      successes
        .map((response: any) => response.data.map((role: any) => role.name))
        .reduce(this.listRolesNames, [])
  }

  private stackUpGetClientRolesRequests(id: string, clientsIds: Array<string>, headers: object) {
    const promises: Promise<AxiosResponse<any>>[] = []
    const buildClientRolesUrl = (cid: string) => `${this.baseUrl}/${id}/role-mappings/clients/${cid}/composite`

    let clientRolesUrl: string
    clientsIds.forEach(async cid => {
      clientRolesUrl = buildClientRolesUrl(cid)
      promises.push(this.request.get(clientRolesUrl, { headers }))
    })

    return promises
  }

  private filterFulfilledResults(response: PromiseSettledResult<any>): AxiosResponse | null {
    return response.status === 'fulfilled' ? response.value : null
  }

  private listRolesNames(list: Array<string>, names: Array<string>) {
    list.push(...names)
    return list
  }

  private async mountHeaders() {
    const accessToken = await this.token.get()
    return { Authorization: `Bearer ${accessToken}` }
  }

  private async savePassword(id: string, credential: string, headers: Headers, options: UpdateCredentialOptions = {}) {
    const endpoint = `${this.baseUrl}/${id}/reset-password`
    const body = {
      type: "password",
      value: credential,
      temporary: options.temporary ? true : false
    }

    await this.request.put(endpoint, body, { headers })
  }

  private async verifyEmail(id: string, headers: Headers) {
    const endpoint = `${this.baseUrl}/${id}/send-verify-email`

    await this.request.put(endpoint, null, { headers })
  }
}

export default UserManager

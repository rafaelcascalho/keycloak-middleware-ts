import { ONE_MILLISECOND } from './constants'

class Token {
  private readonly header: string
  private readonly signed: string
  private readonly signature: Buffer
  private readonly content: { [key: string]: any }

  constructor(token: string) {
    const [header, payload, signature] = token.split('.')

    this.header = this.parse(header)
    this.content = this.parse(payload)
    this.signed = `${header}.${payload}`
    this.signature = Buffer.from(signature)
  }

  isExpired() {
    const expInMs = this.toMs(this.content.exp)
    if (expInMs > Date.now()) return false

    return true
  }

  hasAppRole(app: string, role: string) {
    return this.content.resource_access[app].roles.includes(role)
  }

  hasRealmRole(role: string) {
    return this.content.realm_access.roles.includes(role)
  }

  private parse = (str: string) => JSON.parse(Buffer.from(str, 'base64').toString())

  private toMs = (num: number) => num * ONE_MILLISECOND
}

export default Token

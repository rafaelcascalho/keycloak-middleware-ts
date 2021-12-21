const ONE_MILLISECOND = 1000

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
    const appRoles: Array<string> = this.content.resource_access[app]
    return appRoles.includes(role)
  }

  hasRealmRole(role: string) {
    return this.content.realm_access.roles.includes(role)
  }

  private parse = (str: string) => JSON.parse(Buffer.from(str).toString())

  private toMs = (num: number) => num * ONE_MILLISECOND
}

export default Token

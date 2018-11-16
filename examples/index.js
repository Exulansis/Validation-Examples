const { createCredentialRequest, consumeCredentialResponse } = require('./service')
const { createCredentialResponse } = require('./client')
const { getIdentity } = require('./authenticate')

/**
 * Defining mock data for creating identities
 */
const serviceEncryptionPass = 'service_secret'
const serviceSeed = Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex')

const clientEncryptionPass = 'client_secret'
const clientSeed = Buffer.from('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'hex')

const simulateFlow = async () => {
  const serviceIdentity = await getIdentity(serviceSeed, serviceEncryptionPass)
  const clientIdentity = await getIdentity(clientSeed, clientEncryptionPass)

  /** Normally done by service backend */
  const credentialRequest = await createCredentialRequest(serviceIdentity, serviceEncryptionPass)

  /** Normally done by the wallet */
  const credentialResponse = await createCredentialResponse(credentialRequest, clientIdentity, clientEncryptionPass)

  // /** Validation, and data extraction, can run on the service backend, or on rpi */
  await consumeCredentialResponse(credentialResponse, credentialRequest, serviceIdentity)
}

simulateFlow()

/** The snippet above authenticates as existing identities. In case you wish to create a new identity,
 * use the snippet below
 * 
 * @example
 * const vault = new SoftwareKeyProvider(serviceSeed, serviceEncryptionPass)
 * createNewIdentity(vault, serviceEncryptionPass)
 */

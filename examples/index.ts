import { createCredentialRequest, consumeCredentialResponse } from './service'
import { createCredentialResponse } from './client'
import { getIdentity } from './authenticate'
// import { createNewIdentity } from './create'
// import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'

/**
 * Defining mock data for creating identities
 */

const serviceEncryptionPass = 'service_secret'
const serviceSeed = Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex')

const clientEncryptionPass = 'client_secret'
const clientSeed = Buffer.from('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'hex')

/** Example for how to create a new identity given entropy and encryption password
 * @example
 * const vault = new SoftwareKeyProvider(serviceSeed, serviceEncryptionPass)
 * createNewIdentity(vault, serviceEncryptionPass)
 */

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
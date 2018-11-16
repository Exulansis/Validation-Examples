const { claimsMetadata } = require('jolocom-lib')
const { JSONWebToken } = require('jolocom-lib/js/interactionTokens/JSONWebToken')

/**
 * @description Mock client that parses the credential request, validates it, then generates a response, signs it, and sends it.
 * this would normally be done by the Jolocom Wallet
 * @param credentialRequestJWT - The credential request received from the service
 * @returns JWT - Valid credential response as base64 encoded JWT
 */

exports.createCredentialResponse = async ( requestJWT, clientIdentity, encryptionPass) => {
  /** Decode the received credential request JSON web token */
  const credRequest = JSONWebToken.decode(requestJWT)

  /** Validate the JWT (verifies for expiration date, and signature) */
  await clientIdentity.validateJWT(credRequest)

  /** Create a new signed credential to include in the response, this could also be fetched from a local database */
  const credential = await clientIdentity.create.signedCredential(
    {
      ...credentialCreationOptions,
      subject: clientIdentity.did // Self issued credential, issued by me, to me
    },
    encryptionPass
  )

  /** Create the credential response JSON web token */
  const credentialResponse = await clientIdentity.create.interactionTokens.response.share(
    {
      /** The callback url has to match the one in the request.
       *  This will be populated autmoatically based on the request starting from next major release
       */
      callbackURL: credRequest.payload.interactionToken.callbackURL,
      suppliedCredentials: [credential.toJSON()] // Provide the created credential, in JSON form
    },
    encryptionPass, // The password to decrypt the seed for key generation as part of signing the JWT
    credRequest // The received request, used to set the 'nonce' and 'audience' field on the created response
  )

  return credentialResponse.encode()
}

/**
 * To make things more readable.
 */

const credentialCreationOptions = {
  metadata: claimsMetadata.name,
  claim: {
    givenName: 'Sam',
    familyName: 'Esmail'
  }
}

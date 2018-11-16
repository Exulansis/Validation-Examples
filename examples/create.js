const { _fuelWithEther, pubToAddress } = require('./helper')
const { KeyTypes } = require('jolocom-lib/js/vaultedKeyProvider/types')
const { JolocomLib } = require('jolocom-lib')

/**
 * @description Helper function to create a new jolocom
 * @param vault  - Instance of encrypted key provider, used to derive keys for Eth transaction / did document signing
 * @param encryptionPass  - Password to decrypt the seed
 * @returns {IdentityWallet} - Instance of identity wallet ready for use
 */

exports.createNewIdentity = async (vault, encryptionPass) => {
  /** Derive a keypair used to pay for ethereum transactions */
  const pubKeyToFuel = vault.getPublicKey({ derivationPath: KeyTypes.ethereumKey, encryptionPass })

  /** Fuel the Ethereum key with 0.1 ether to pay for transaction */
  await _fuelWithEther(pubToAddress(pubKeyToFuel))

  /** Create a default jolocom registry, and initiate identity creation */
  const registry = JolocomLib.registries.jolocom.create()
  return registry.create(vault, encryptionPass)
}

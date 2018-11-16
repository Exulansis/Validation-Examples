const { JolocomLib } = require('jolocom-lib')
const { SoftwareKeyProvider } = require('jolocom-lib/js/vaultedKeyProvider/softwareProvider')
const { KeyTypes } = require('jolocom-lib/js/vaultedKeyProvider/types')

exports.getIdentity = async (seed, password) => {
  const reg = JolocomLib.registries.jolocom.create()
  /** Defining seed (32 random bytes) that will be used to derive service identity keys
   * and password that will be used to encrypt the seed using aes256 cbc
   */
  /** The vault stores the encrypted seed, and can derive keys for signatures given the decryption pass and derivation path
   * Will be modified in next major release to take the encrypted seed as a constructor argument, instead of cleartext,
   * and then encrypting.
   */
  const vault = new SoftwareKeyProvider(seed, password)

  /** Data needed to derive a key from the vault */
  const keyDerivationMetadata = {
    derivationPath: KeyTypes.jolocomIdentityKey, // equals to "m/73'/0'/0'/0" - a bip 32 compliant derivation path
    encryptionPass: password // password that can be used to decrypt the seed
  }

  /** Instantiate an identity wallet, it encapsulates functionality related to creating signed credentials and JSON web tokens */
  return reg.authenticate(vault, keyDerivationMetadata)
}
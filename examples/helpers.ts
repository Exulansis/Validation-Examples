import * as fetch from 'node-fetch'
import * as wallet from 'ethereumjs-wallet'

/**
 * @description Fuels the address with a bit of test Eth so it can pay for the registration
 * @param address - Ethereum address to transfer 0.1 rinkeby Ether to.
 *
 * We intend to deprecate this in favor of meta transactions / executable signed messages in the close future,
 * in the meantime, fueling is required.
 */

/** A jolocom hosted fueling service */

export const _fuelWithEther = (address: string) => {
  console.log(address)
  return fetch('https://faucet.jolocom.com/request/', {
    method: 'POST',
    body: JSON.stringify({ address: `0x${address}` }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * @description Converts public Ethereum key to corresponding address
 * @param key - Public key of ethereum account
 */

export const pubToAddress = (key: Buffer): string => new wallet.fromPublicKey(key, true).getAddress().toString('hex')

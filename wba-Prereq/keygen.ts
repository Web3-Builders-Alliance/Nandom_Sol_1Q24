import { Keypair } from '@solana/web3.js'

//Generating a new keypair
let kp = Keypair.generate()

console.log(
	`Public: You've generated a new Solana wallet:${kp.publicKey.toBase58()}`
)
console.log(`Private: You've generated a new Solana wallet:${kp.secretKey}`)

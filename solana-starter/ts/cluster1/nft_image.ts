import wallet from '../wba-wallet.json'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
	createGenericFile,
	createSignerFromKeypair,
	signerIdentity,
} from '@metaplex-foundation/umi'
import { createIrysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { readFile } from 'fs/promises'

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com')
const irysUploader = createIrysUploader(umi)

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet))
const signer = createSignerFromKeypair(umi, keypair)

umi.use(irysUploader())
umi.use(signerIdentity(signer))
;(async () => {
	try {
		const image = await readFile(
			'./home/nandom/Desktop/projects/solana-starter/ts/cluster1/images/generug'
		)

		console.log(image)

		const nftImage = createGenericFile(image, 'generug')
		const [myUri] = await umi.uploader.upload([nftImage])
		console.log('Your image URI: ', myUri)
	} catch (error) {
		console.log('Oops.. Something went wrong', error)
	}
})()

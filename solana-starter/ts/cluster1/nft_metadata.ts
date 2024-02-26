import wallet from '../wba-wallet.json'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
	createGenericFile,
	createSignerFromKeypair,
	signerIdentity,
} from '@metaplex-foundation/umi'
import { createIrysUploader } from '@metaplex-foundation/umi-uploader-irys'

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com')
const irysUploader = createIrysUploader(umi)

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet))
const signer = createSignerFromKeypair(umi, keypair)

umi.use(signerIdentity(signer))
;(async () => {
	try {
		// Follow this JSON structure
		// https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

		const image =
			'https://arweave.net/3FEbC0_-__RsNJmzo4KNA6QSA-Q0bywtGNelDliOECw'
		const metadata = {
			name: 'generug',
			symbol: 'GEN',
			description: 'This is a generug nft',
			image,
			attributes: [
				{ trait_type: 'Feature', value: 'Vaporwave Pink' },
				{ trait_type: 'Style', value: 'Pixelated' },
				{ trait_type: 'Background', value: 'Minty Green' },
			],
			properties: {
				files: [
					{
						type: 'image/png',
						uri: image,
					},
				],
			},
			creators: [],
		}
		const myUri = await irysUploader.uploadJson(metadata)
		console.log('Your image URI: ', myUri)
	} catch (error) {
		console.log('Oops.. Something went wrong', error)
	}
})()

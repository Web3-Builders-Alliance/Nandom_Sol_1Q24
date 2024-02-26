import wallet from '../wba-wallet.json'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
	createMetadataAccountV3,
	CreateMetadataAccountV3InstructionAccounts,
	CreateMetadataAccountV3InstructionArgs,
	DataV2Args,
	MPL_TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'
import {
	createSignerFromKeypair,
	signerIdentity,
	publicKey,
	publicKeyBytes,
} from '@metaplex-foundation/umi'
import { string } from '@metaplex-foundation/umi/serializers'

// Define our Mint address
const mint = publicKey('AiKotxhyKdWwoSEiRDsTCM9dasL3xfd2ovRjSwhFmKGw')

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com')
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet))
const signer = createSignerFromKeypair(umi, keypair)
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)))

const metadata = umi.eddsa.findPda(MPL_TOKEN_METADATA_PROGRAM_ID, [
	Buffer.from('metadata'),
	publicKeyBytes(MPL_TOKEN_METADATA_PROGRAM_ID),
	publicKeyBytes(mint),
])

;(async () => {
	try {
		// Start here
		let accounts: CreateMetadataAccountV3InstructionAccounts = {
			metadata,
			mint,
			mintAuthority: signer,
			payer: signer,
			updateAuthority: signer,
		}

		let data: DataV2Args = {
			name: 'WBA Token',
			symbol: 'WBA',
			uri: '',
			sellerFeeBasisPoints: 300,
			creators: null,
			collection: null,
			uses: null,
		}

		let args: CreateMetadataAccountV3InstructionArgs = {
			data,
			isMutable: true,
			collectionDetails: null,
		}

		let tx = createMetadataAccountV3(umi, {
			...accounts,
			...args,
		})

		let result = await tx
			.sendAndConfirm(umi)
			.then((r) => r.signature.toString())
		console.log(result)
	} catch (e) {
		console.error(`Oops, something went wrong: ${e}`)
	}
})()

import { Keypair } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export const beneficiaries = [
    {
        key:Keypair.generate().publicKey,
        allocatedTokens:new BN(300000),
        claimedTokens:new BN(0),
        lastClaimTime:new BN(1958000)
    },
    {
        key:Keypair.generate().publicKey,
        allocatedTokens:new BN(1958000),
        claimedTokens:new BN(0),
        lastClaimTime:new BN(1958000)
    }
]
export const updateBeneficiaries = [
    {
        key:Keypair.generate().publicKey,
        allocatedTokens:new BN(100),
        claimedTokens:new BN(0),
        lastClaimTime:new BN(32102)
    },
    {
        key:Keypair.generate().publicKey,
        allocatedTokens:new BN(2659),
        claimedTokens:new BN(0),
        lastClaimTime:new BN(132)
    }
]
import { Keypair, PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export const beneficiaries = [
  {
    key: Keypair.generate().publicKey,
    allocatedTokens: new BN(100),
    claimedTokens: new BN(0),
    lastClaimTime: new BN(0),
  },
  {
    key: Keypair.generate().publicKey,
    allocatedTokens: new BN(70),
    claimedTokens: new BN(0),
    lastClaimTime: new BN(0),
  },
];
export const updateBeneficiaries = [
  {
    key: new PublicKey("BFjgoGvjkMcFuPPvpDLJHwKTSMneaP3nNsz1uCbz69RW"),
    allocatedTokens: new BN(80),
    claimedTokens: new BN(0),
    lastClaimTime: new BN(0),
  },
  {
    key:new PublicKey("DxqA9eeszbpVgYAfESrUMWC7Jur4kX7ZCQjMPjFKFJ57"),
    allocatedTokens: new BN(60),
    claimedTokens: new BN(0),
    lastClaimTime: new BN(0),
  },
];

export type BeneficiariesType = {
  key: PublicKey;
  allocatedTokens: BN;
  claimedTokens: BN;
  lastClaimTime: BN;
};

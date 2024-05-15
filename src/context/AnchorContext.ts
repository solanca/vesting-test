import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';

import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Vesting } from '../anchor/idl';

interface ProgramContextProps {
  dataAccount: PublicKey | null;
  dataBump: number | null;
  escrowWalletPda: PublicKey | null;
  escrowBump: number | null;
  program: Program<Vesting> | null;
}

export const ProgramContext = createContext<ProgramContextProps>({
  dataAccount: null,
  dataBump: null,
  escrowWalletPda: null,
  escrowBump: null,
  program: null,
});

export const useProgram = () => useContext(ProgramContext);

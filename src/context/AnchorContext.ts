import { createContext, useContext } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";

import { Vesting } from "../anchor/idl";

interface ProgramContextProps {
  dataAccount: PublicKey | null;
  dataBump: number | null;
  escrowWalletPda: PublicKey | null;
  escrowBump: number | null;
  program: Program<Vesting> | null;
  provider: AnchorProvider | null;
  connection: Connection | null;
}

export const ProgramContext = createContext<ProgramContextProps>({
  dataAccount: null,
  dataBump: null,
  escrowWalletPda: null,
  escrowBump: null,
  program: null,
  provider: null,
  connection: null,
});

export const useProgram = () => useContext(ProgramContext);

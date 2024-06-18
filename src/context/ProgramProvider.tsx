import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Vesting } from "../anchor/idl";
import idl from "../anchor/vesting.json";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { ProgramContext } from "./AnchorContext";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataAccount, setDataAccount] = useState<PublicKey | null>(null);
  const [dataBump, setDataBump] = useState<number | null>(null);
  const [escrowWalletPda, setEscrowWalletPda] = useState<PublicKey | null>(
    null
  );
  const [escrowBump, setEscrowBump] = useState<number | null>(null);
  const [anchorProvider, setAnchorProvider] = useState<AnchorProvider | null>(
    null
  );
  const [con, setCon] = useState<Connection | null>(null);

  const [program, setProgram] = useState<Program<Vesting> | null>(null);
  const wallet = useAnchorWallet();
  const programID = new PublicKey(`${import.meta.env.VITE_PROGRAM_ID}`);
  // console.log('pubkey==',programID.toBase58())
  const tokenMint = new PublicKey(import.meta.env.VITE_TOKEN_MINT);

  useEffect(() => {
    const setupProgram = async () => {
      if (!wallet) return;
      const provider = getProvider();
      setAnchorProvider(provider);
      //@ts-ignore
      const program = new Program<Vesting>(idl, programID, provider);
      const [dataAccount, dataBump] = await PublicKey.findProgramAddress(
        [Buffer.from("data_account"), tokenMint.toBuffer()],
        program.programId
      );
      const [escrowWalletPda, escrowBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("escrow_wallet"), tokenMint.toBuffer()],
        program.programId
      );

      setDataAccount(dataAccount);
      setDataBump(dataBump);
      setEscrowWalletPda(escrowWalletPda);
      setEscrowBump(escrowBump);
      setProgram(program);
    };

    setupProgram();
  }, [wallet]);

  const getProvider = () => {
    if (!wallet) return null;
    const connection = new Connection(
      import.meta.env.VITE_SOL_RPC_URL
        ? import.meta.env.VITE_SOL_RPC_URL
        : clusterApiUrl("devnet"),
      {
        commitment: "processed",
      }
    );
    // const connection = new Connection(clusterApiUrl("devnet"), {
    //   commitment: "processed",
    // });
    setCon(connection);
    return new AnchorProvider(connection, wallet, { commitment: "processed" });
  };

  return (
    //@ts-ignore
    <ProgramContext.Provider
      value={{
        dataAccount,
        dataBump,
        escrowWalletPda,
        escrowBump,
        program,
        provider: anchorProvider,
        connection: con,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export default ProgramProvider;

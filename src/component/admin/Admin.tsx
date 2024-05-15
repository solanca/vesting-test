import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Keypair, clusterApiUrl } from "@solana/web3.js";
import { web3, BN, utils } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { beneficiaries, updateBeneficiaries } from "../../constant/mock";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  // createMint,
  // getOrCreateAssociatedTokenAccount,
  // mintTo,
} from "@solana/spl-token";
import { useProgram } from "../../context/AnchorContext";
import { useState } from "react";
import { CircularProgress, Dialog, Grid, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toast";

type Props = {};

const tokenMint = new PublicKey("9HBACuCcKar38F6jAawhrAGMD4mWiSHfD6q3gXWNAp5X");

const Admin = (_props: Props) => {
  const { dataAccount, dataBump, escrowWalletPda, escrowBump, program } =
    useProgram();
  const [day, setDay] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = useAnchorWallet();

  const { connected } = useWallet();
  const sender = wallet?.publicKey;

  const handleInitialize = async () => {
    if (!connected && !program) {
      return;
    }

    //@ts-ignore

    try {
      setLoading(true);
      //@ts-ignore
      await program.rpc.initialize(
        //@ts-ignore
        beneficiaries,
        new BN(1000),
        new BN(9),
        new BN(199900),
        {
          accounts: {
            dataAccount: dataAccount,
            escrowWallet: escrowWalletPda,
            walletToWithdrawFrom: new PublicKey(
              "CUKAWZ4zgD7tbpk1PTFr9vxYuCFVAnhoMfNr6jiaR7aw"
            ),
            tokenMint: tokenMint,
            sender: sender,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          },
        }
      );
      console.log("Greeting account created!");
    } catch (error) {
      toast.error(error.message)
      console.error("Error creating greeting account:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleMint = async () => {
  //   if (!wallet || !wallet.publicKey) {
  //     console.error("Wallet not connected");
  //     return;
  //   }

  //   // Initialize connection to the devnet
  //   const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  //   // Use the connected wallet as the payer
  //   // const payer = wallet_p.wallet;
  //   const secret = [
  //     4, 203, 170, 140, 52, 111, 194, 79, 184, 206, 170, 25, 182, 108, 154, 75,
  //     251, 39, 109, 71, 204, 249, 137, 240, 47, 92, 5, 61, 247, 48, 183, 151,
  //     152, 91, 68, 24, 87, 160, 224, 30, 240, 38, 70, 237, 131, 147, 128, 232,
  //     21, 89, 248, 148, 251, 123, 115, 191, 129, 24, 99, 200, 72, 8, 202, 5,
  //   ];

  //   const payer = Keypair.fromSecretKey(new Uint8Array(secret));

  //   const mintAuthority = wallet; // Use the wallet as the mint authority
  //   const freezeAuthority = null; // Set to null if not needed
  //   const mint = await createMint(
  //     connection,
  //     payer,
  //     mintAuthority.publicKey,
  //     null,
  //     9 // Decimals
  //   );

  //   console.log("Token Mint Public Key:", mint.toBase58());

  //   // Get or create the associated token account for the initializer (wallet)
  //   const initializerTokenAccount = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     payer,
  //     mint,
  //     payer.publicKey
  //   );

  //   console.log(
  //     "Initializer Token Account:",
  //     initializerTokenAccount.address.toBase58()
  //   );

  //   // Mint some tokens to the initializer's token account
  //   const signature = await mintTo(
  //     connection,
  //     payer,
  //     mint,
  //     initializerTokenAccount.address,
  //     mintAuthority.publicKey,
  //     1000000000000000 // Amount to mint (adjust as needed)
  //   );

  //   console.log(
  //     "Minted tokens to the initializer's token account, signature:",
  //     signature
  //   );
  // };

  const handleFetch = async () => {
    if (!program) return;
    try {
      setLoading(true);
      //@ts-ignore
      const info = await program.account.dataAccount.fetch(dataAccount);
      console.log("info==", info);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateLaunchDay = async () => {
    try {
      setLoading(true);

      //@ts-ignore
      await program.rpc.updateLaunchDay(new BN(day), {
        accounts: {
          dataAccount: dataAccount,
          initializer: sender,
          tokenMint: tokenMint,
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const addBeneficiaries = async () => {
    try {
      setLoading(true);
      //@ts-ignore
      await program.rpc.addBeneficiaries(updateBeneficiaries, {
        accounts: {
          dataAccount: dataAccount,
          initializer: sender,
          tokenMint: tokenMint,
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    try {
      setLoading(true);
      //@ts-ignore
      await program?.rpc.claim(dataBump, escrowBump, {
        accounts: {
          dataAccount: dataAccount,
          escrowWallet: escrowWalletPda,
          sender: sender,
          tokenMint: tokenMint,
          walletToDepositTo: sender,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      });
    } catch (error) {
      toast.error(error.message)
      console.error("claim Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems={"center"}>

      <button onClick={handleInitialize}>initialize</button>
      <button onClick={handleFetch}>fetch</button>
      {/* <button onClick={handleMint}>mint</button> */}
      <TextField
        value={day}
        type="number"
        onChange={(e) => setDay(Number(e.target.value))}
      />
      <button onClick={updateLaunchDay}>update launchDay</button>
      <button onClick={addBeneficiaries}>update beneficiaries</button>
      <button onClick={claimToken}>claim</button>
      </Grid>
      <Dialog
        open={loading}
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <CircularProgress />
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default Admin;

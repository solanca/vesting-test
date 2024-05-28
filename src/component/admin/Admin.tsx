import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { web3, BN, utils } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  // createMint,
  // getOrCreateAssociatedTokenAccount,
  // mintTo,
} from "@solana/spl-token";
import { useProgram } from "../../context/AnchorContext";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toast";
import { unixTimestampToDatetimeLocal } from "../../utils/js";
import axios from "axios";

type Props = {};

const tokenMint = new PublicKey("FZ5bAZV3EDas8jbzaWDfQb46ESu6ah48fa8Msjgsh3CZ");

const Admin = (_props: Props) => {
  const {
    dataAccount,
    dataBump,
    escrowWalletPda,
    escrowBump,
    program,
    provider,
    connection,
  } = useProgram();
  const [day, setDay] = useState<string>("");
  const [period,setPeriod] = useState<string>("7");
  const [loading, setLoading] = useState<boolean>(false);
  const [launchDay, setLaunchDay] = useState<string>("");
  const [claimPeriod, setClaimPeriod] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1000);

  const wallet = useAnchorWallet();

  const { connected } = useWallet();
  const sender = wallet?.publicKey;

  const handleInitialize = async () => {
    if (!connected && !program && !dataAccount && !escrowWalletPda) {
      return;
    }

    //@ts-ignore

    try {
      setLoading(true);
      await program?.methods
        .initialize(
          // Array.from(Buffer.from(merkleRoot, "hex")),
          new BN(amount),
          new BN(9),
          new BN(Math.floor(Date.now() / 1000)),
          new BN(60*60*24*7) //a week
        )
        .accounts({
          dataAccount: dataAccount as any,
          escrowWallet: escrowWalletPda as any,
          walletToWithdrawFrom: new PublicKey(
            "885FvmgbycQ2RYbggjzqYD6rzZsdVM4ZWFArSoneKvb7"
          ),
          tokenMint: tokenMint,
          sender: sender,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          //@ts-ignore
        })
        .rpc();

      console.log("Greeting account created!");
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
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
      const info = await program.account.dataAccount.fetch(dataAccount as any);
      //@ts-ignore

      console.log("info==", info, new PublicKey(info.escrowWallet).toBase58());

      // setRecipients(info.beneficiaries as BeneficiariesType[]);

      // console.log("info==", info.nowTime.toNumber());
      setLaunchDay(unixTimestampToDatetimeLocal(info.launchDay.toNumber()));
      setClaimPeriod(info.claimPeriod.toNumber() /(60*60*24))
      // console.log("info==", escrowWalletPda?.toBase58(),escrowWalletInfo);
    } catch (error) {
      console.log("err==", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLaunchDay = async () => {
    try {
      setLoading(true);
      console.log("launchDay==", day);

      //@ts-ignore
      var newDate = new Date(day);
      // var newDate = new Date( tempDay[2], tempDay[1] - 1, tempDay[0]);
      console.log("newdata==", newDate.getTime() / 1000);
      let unixTime = newDate.getTime() / 1000;
      // console.log(newDate.getTime());
      //@ts-ignore
      const res = await program.rpc.updateLaunchDay(new BN(unixTime), {
        accounts: {
          dataAccount: dataAccount,
          initializer: sender,
          tokenMint: tokenMint,
        },
      });
      console.log("ress===", res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const updateClaimPeriod = async () => {
    try {
      setLoading(true);
      
      const res = await program?.methods.updateClaimPeriod(new BN(Number(period)*60*60*24)).accounts({
        dataAccount:dataAccount as any,
        initializer:sender,
        tokenMint:tokenMint
      }).rpc();
      
      console.log("ress===", res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    try {
      setLoading(true);
      const transaction = new Transaction();
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({ units: 300000 })
      );
      if (!sender || !provider || !program || !connection) return;
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        sender
        // true,

        // ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get/${sender.toBase58()}`
      );

      //@ts-ignore
      if (res.data) {
        console.log("res==", res.data.pixiz);
        let allocatedTokens = new BN(res.data.pixiz);
        let claimedTokens = new BN(res.data.claimedTokens);
        let lastClaimTime = new BN(res.data.lastClaimTime);

        const response = await program?.methods
          .claim(
            dataBump as number,
            escrowBump as number,

            allocatedTokens,
            claimedTokens,
            lastClaimTime
          )
          .accounts({
            dataAccount: dataAccount as any,
            escrowWallet: escrowWalletPda as any,
            sender: sender,
            tokenMint: tokenMint,
            walletToDepositTo: associatedTokenAddress,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .rpc();
        console.log("repo==", response);

        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/claimed/${response}`
        );
        console.log('resp==',resp.data);
      }
    } catch (error) {
      //@ts-ignore

      if (error.response?.data) {
        //@ts-ignore
        toast.error(error.response.data);
      } else {
        // @ts-ignore
        toast.error(error.message);
      }
      console.error("claim Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container columnGap={2} alignItems={"center"}>
        <TextField
          label="lock amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleInitialize}>initialize</Button>

        
        {/* <button onClick={handleMint}>mint</button> */}
        <TextField
          value={day}
          type="datetime-local"
          onChange={(e) => setDay(e.target.value)}
        />
        <Button variant="contained" onClick={updateLaunchDay}>update launchDay</Button>
        <TextField
          value={period}
          type="number"
          sx={{width:"20ch"}}
          InputProps={{endAdornment:<InputAdornment position="end">days</InputAdornment>}}
          onChange={(e) => setPeriod(e.target.value)}
        />
        <Button variant="contained" onClick={updateClaimPeriod}>update ClaimPeriod</Button>

        {/* <button onClick={fetchTime}>fetchTime</button> */}
      </Grid>
      <>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" onClick={handleFetch}>fetch</Button>
        <Typography variant="h6" mt={4}>
          Launch Day:{launchDay}
        </Typography>
        <Typography variant="h6" mt={4}>
          Claim Period:{claimPeriod}
        </Typography>
        <Button color="secondary" variant="contained" onClick={claimToken}>claim</Button>
      </>

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
    </>
  );
};

export default Admin;

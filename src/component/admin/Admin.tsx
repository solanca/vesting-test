import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
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
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ToastContainer, toast } from "react-toast";
import { unixTimestampToDatetimeLocal } from "../../utils/js";
import axios from "axios";

type Props = {};

const tokenMint = new PublicKey("FZ5bAZV3EDas8jbzaWDfQb46ESu6ah48fa8Msjgsh3CZ");

const CapitalButton = styled(Button)(() => ({
  textTransform: "capitalize",
}));

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
  const [period, setPeriod] = useState<string>("7");
  const [loading, setLoading] = useState<boolean>(false);
  const [launchDay, setLaunchDay] = useState<string>("");
  const [claimPeriod, setClaimPeriod] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1000);
  const [claimRateForLaunchDay, setClaimRateForLaunchDay] =
    useState<string>("15");
  const [claimRatePerDays, setClaimRatePerDays] = useState<string>("3");
  const [fetching, setFetching] = useState<boolean>(false);

  const [rateForLaunchDay, setRateForLaunchDay] = useState<number>(0);
  const [ratePerDays, setRatePerDays] = useState<number>(0);

  const wallet = useAnchorWallet();

  useEffect(() => {
    const fetchData = async () => {
      if (provider) {
        await handleFetch();
      }
    };

    fetchData();
  }, [provider]);

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
          new BN(60 * 60 * 24 * 7), //a week
          new BN(15), //15%
          new BN(3) //3%
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
      await handleFetch();
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
      setFetching(true);
      //@ts-ignore
      const info = await program.account.dataAccount.fetch(dataAccount as any);
      //@ts-ignore

      console.log("info==", info, new PublicKey(info.escrowWallet).toBase58());

      // setRecipients(info.beneficiaries as BeneficiariesType[]);

      // console.log("info==", info.nowTime.toNumber());
      setLaunchDay(unixTimestampToDatetimeLocal(info.launchDay.toNumber()));
      setClaimPeriod(info.claimPeriod.toNumber() / (60 * 60 * 24));
      setRateForLaunchDay(info.claimRateForLaunchDay);
      setRatePerDays(info.claimRatePerDays);
      // console.log("info==", escrowWalletPda?.toBase58(),escrowWalletInfo);
    } catch (error) {
      console.log("err==", error);
    } finally {
      setFetching(false);
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
      await handleFetch();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const updateClaimPeriod = async () => {
    try {
      setLoading(true);

      const res = await program?.methods
        .updateClaimPeriod(new BN(Number(period) * 60 * 60 * 24))
        .accounts({
          dataAccount: dataAccount as any,
          initializer: sender,
          tokenMint: tokenMint,
        })
        .rpc();

      console.log("ress===", res);
      await handleFetch();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const updateClaimRateWhenLaunchDay = async () => {
    try {
      setLoading(true);

      await program?.methods
        .updateClaimRateForLaunchday(new BN(Number(claimRateForLaunchDay)))
        .accounts({
          dataAccount: dataAccount as any,
          initializer: sender,
          tokenMint: tokenMint,
        })
        .rpc();
      await handleFetch();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const updateClaimRatePerDays = async () => {
    try {
      setLoading(true);

      await program?.methods
        .updateClaimRatePerDays(new BN(Number(claimRatePerDays)))
        .accounts({
          dataAccount: dataAccount as any,
          initializer: sender,
          tokenMint: tokenMint,
        })
        .rpc();
      await handleFetch();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    try {
      setLoading(true);
      const transaction = new Transaction();
      const PRIORITY_RATE = 1000000;
      const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_RATE,
      });
      // transaction.add(
      //   ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100 })
      // );
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

        const txInstruction = await program?.methods
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
          .instruction();
        console.log("txInstruction==", txInstruction);
        transaction.add(txInstruction);
        transaction.add(PRIORITY_FEE_IX);
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = sender;

        const signedTransaction = await wallet.signTransaction(transaction);

        const serializedTransaction = signedTransaction.serialize({
          requireAllSignatures: true,
        });

        console.log(
          "serializedTransaction==",
          serializedTransaction.toString("base64")
        );

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/submit-transaction`,
          {
            transaction: serializedTransaction.toString("base64"), // Convert to base64
          }
        );

        console.log("response==", response.data);

        // const resp = await axios.get(
        //   `${import.meta.env.VITE_BACKEND_URL}/claimed/${response}`
        // );
        // console.log("resp==", resp.data);
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
      <Grid container spacing={2} flexDirection="column" alignItems={"center"}>
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              label="lock amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <CapitalButton variant="contained" onClick={handleInitialize}>
              initialize
            </CapitalButton>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              value={day}
              type="datetime-local"
              onChange={(e) => setDay(e.target.value)}
            />
            <CapitalButton variant="contained" onClick={updateLaunchDay}>
              update launchDay
            </CapitalButton>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              value={period}
              type="number"
              label="period"
              // sx={{ width: "20ch" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">days</InputAdornment>
                ),
              }}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <CapitalButton variant="contained" onClick={updateClaimPeriod}>
              update ClaimPeriod
            </CapitalButton>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              value={claimRateForLaunchDay}
              type="number"
              // sx={{ width: "20ch" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(e) => setClaimRateForLaunchDay(e.target.value)}
            />
            <CapitalButton
              variant="contained"
              onClick={updateClaimRateWhenLaunchDay}
            >
              update claim rate when launch day
            </CapitalButton>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              value={claimRatePerDays}
              type="number"
              // sx={{ width: "20ch" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(e) => setClaimRatePerDays(e.target.value)}
            />
            <CapitalButton variant="contained" onClick={updateClaimRatePerDays}>
              update claim rate per days
            </CapitalButton>
          </Grid>
        </Grid>
      </Grid>
      <>
        <Divider sx={{ my: 2 }} />
        {provider && (
          <Grid
            container
            spacing={2}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Grid item>
              <Grid container alignItems={"center"}>
                <Typography variant="h6" mr={3}>
                  Launch Day:
                </Typography>
                {fetching ? (
                  <Skeleton width={30} />
                ) : (
                  <Typography variant="h6">{launchDay}</Typography>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems={"center"}>
                <Typography variant="h6" mr={3}>
                  Claim Period:
                </Typography>
                {fetching ? (
                  <Skeleton width={30} />
                ) : (
                  <Typography variant="h6">{claimPeriod} days</Typography>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems={"center"}>
                <Typography variant="h6" mr={3}>
                  Claim Rate when LaunchDay:
                </Typography>
                {fetching ? (
                  <Skeleton width={30} />
                ) : (
                  <Typography variant="h6">{rateForLaunchDay}%</Typography>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems={"center"}>
                <Typography variant="h6" mr={3}>
                  Claim Rate per Days:
                </Typography>
                {fetching ? (
                  <Skeleton width={30} />
                ) : (
                  <Typography variant="h6"> {ratePerDays}%</Typography>
                )}
              </Grid>
            </Grid>
            {/* <CapitalButton variant="contained" onClick={handleFetch}>
            fetch
          </CapitalButton> */}
          </Grid>
        )}
      </>
      <Button color="secondary" variant="contained" onClick={claimToken}>
        claim
      </Button>

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

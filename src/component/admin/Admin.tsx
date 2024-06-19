import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, ComputeBudgetProgram } from "@solana/web3.js";
import { web3, BN, utils } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
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

const tokenMint = new PublicKey(import.meta.env.VITE_TOKEN_MINT);

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
  const [addAmount, setAddAmount] = useState<number>(500);

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

    try {
      if (sender) {
        setLoading(true);

        const walletToWithdrawFrom = await getAssociatedTokenAddress(
          tokenMint,
          sender
        );

        const tx = await program?.methods
          .initialize(
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
            walletToWithdrawFrom,
            tokenMint: tokenMint,
            sender: sender,
          })
          .rpc();

        console.log("tx==", tx);
        await handleFetch();
      }
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
      console.error("Error creating greeting account:", error);
    } finally {
      setLoading(false);
    }
  };
  const addFunds = async () => {
    if (!connected && !program && !dataAccount && !escrowWalletPda) {
      return;
    }
    try {
      if (sender) {
        setLoading(true);

        const walletToWithdrawFrom = await getAssociatedTokenAddress(
          tokenMint,
          sender
        );

        const tx = await program?.methods
          .addFunds(dataBump as number, escrowBump as number, new BN(addAmount))
          .accounts({
            escrowWallet: escrowWalletPda as any,
            walletToWithdrawFrom,
            tokenMint: tokenMint,
            sender: sender,
          })
          .rpc();

        console.log("tx====", tx);
        await handleFetch();
      }
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
      console.error("Error creating greeting account:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleWithdraw = async () => {
    if (!connected && !program && !dataAccount && !escrowWalletPda) {
      return;
    }
    try {
      if (sender) {
        setLoading(true);
        const walletToWithdrawFrom = await getAssociatedTokenAddress(
          tokenMint,
          sender
        );

        const tx = await program?.methods
          .withdraw(dataBump as number, escrowBump as number)
          .accounts({
            dataAccount: dataAccount as PublicKey,
            escrowWallet: escrowWalletPda as any,
            walletToWithdrawFrom,
            tokenMint: tokenMint,
            sender: sender,
          })
          .rpc();

        console.log("tx====", tx);
        await handleFetch();
      }
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
      console.error("Error creating greeting account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!program) return;
    try {
      setFetching(true);
      //@ts-ignore
      const info = await program.account.dataAccount.fetch(dataAccount as any);
      //@ts-ignore

      console.log("info==", info, new PublicKey(info.escrowWallet).toBase58());

      setLaunchDay(unixTimestampToDatetimeLocal(info.launchDay.toNumber()));
      setClaimPeriod(info.claimPeriod.toNumber() / (60 * 60 * 24));
      setRateForLaunchDay(info.claimRateForLaunchDay);
      setRatePerDays(info.claimRatePerDays);
    } catch (error) {
      console.log("err==", error);
    } finally {
      setFetching(false);
    }
  };

  const updateLaunchDay = async () => {
    try {
      setLoading(true);

      //@ts-ignore
      var newDate = new Date(day);
      let unixTime = newDate.getTime() / 1000;
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
      console.log(error);
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
      if (!sender || !provider || !program || !connection) return;
      const walletToDepositTo = await getAssociatedTokenAddress(
        tokenMint,
        sender
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
            walletToDepositTo,
            // systemProgram: web3.SystemProgram.programId,
            // tokenProgram: TOKEN_2022_PROGRAM_ID,
            // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .instruction();
        transaction.add(txInstruction);
        transaction.add(PRIORITY_FEE_IX);
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("finalized");
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
        <Grid item>
          <Grid container columnGap={2}>
            <TextField
              value={addAmount}
              type="number"
              // sx={{ width: "20ch" }}

              onChange={(e) => setAddAmount(Number(e.target.value))}
            />
            <CapitalButton variant="contained" onClick={addFunds}>
              AddAmount
            </CapitalButton>
          </Grid>
        </Grid>
        <Grid item>
          <CapitalButton variant="contained" onClick={handleWithdraw}>
            withdraw
          </CapitalButton>
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

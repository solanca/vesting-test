import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Keypair, clusterApiUrl } from "@solana/web3.js";
import { web3, BN, utils } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BeneficiariesType,
  beneficiaries,
  updateBeneficiaries,
} from "../../constant/mock";
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
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toast";
import { unixTimestampToDatetimeLocal } from "../../utils/js";

type Props = {};

const tokenMint = new PublicKey("FZ5bAZV3EDas8jbzaWDfQb46ESu6ah48fa8Msjgsh3CZ");

const Admin = (_props: Props) => {
  const { dataAccount, dataBump, escrowWalletPda, escrowBump, program } =
    useProgram();
  const [day, setDay] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recipients, setRecipients] = useState<BeneficiariesType[] | null>();
  const [launchDay, setLaunchDay] = useState<string>("");
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
        new BN(Math.floor(Date.now() / 1000)),
        {
          accounts: {
            dataAccount: dataAccount,
            escrowWallet: escrowWalletPda,
            walletToWithdrawFrom: new PublicKey(
              "885FvmgbycQ2RYbggjzqYD6rzZsdVM4ZWFArSoneKvb7"
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
      const info = await program.account.dataAccount.fetch(dataAccount);
      //@ts-ignore

      console.log("info==", info, new PublicKey(info.escrowWallet).toBase58());
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      setRecipients(info.beneficiaries as BeneficiariesType[]);

      // console.log("info==", info.nowTime.toNumber());
      setLaunchDay(unixTimestampToDatetimeLocal(info.launchDay.toNumber()));
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
      console.log(error);
      //@ts-ignore
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    try {
      setLoading(true);
      if (!sender) return;
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        sender
        // true,

        // ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log(
        "acc==",
        dataBump,
        escrowBump,
        associatedTokenAddress.toBase58(),
        dataAccount?.toBase58(),
        escrowWalletPda?.toBase58(),
        sender.toBase58(),
        tokenMint.toBase58(),
        utils.token.TOKEN_PROGRAM_ID.toBase58(),
        ASSOCIATED_TOKEN_PROGRAM_ID.toBase58(),
        web3.SystemProgram.programId.toBase58()
      );
      //@ts-ignore
      const response = await program?.rpc.claim(dataBump, escrowBump, {
        accounts: {
          dataAccount: dataAccount,
          escrowWallet: escrowWalletPda,
          sender: sender,
          tokenMint: tokenMint,
          walletToDepositTo: associatedTokenAddress,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
      });
      console.log("repo==", response);
    } catch (error) {
      //@ts-ignore
      toast.error(error.message);
      console.error("claim Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2} alignItems={"center"}>
        <button onClick={handleInitialize}>initialize</button>
        <button onClick={handleFetch}>fetch</button>
        {/* <button onClick={handleMint}>mint</button> */}
        <TextField
          value={day}
          type="datetime-local"
          onChange={(e) => setDay(e.target.value)}
        />
        <button onClick={updateLaunchDay}>update launchDay</button>
        <button onClick={addBeneficiaries}>update beneficiaries</button>
        <button onClick={claimToken}>claim</button>
        {/* <button onClick={fetchTime}>fetchTime</button> */}
      </Grid>
      <>
        <Divider sx={{ my: 2 }} />
        {recipients && (
          <Grid container flexDirection={"column"}>
            <Typography variant="h5">beneficiaries list and status</Typography>
            <Grid item>
              <Grid container>
                <Grid item md={3}>
                  <Typography> Address</Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography>Total token amount</Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography>Claimed token amount</Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography>Last claim time</Typography>
                </Grid>
              </Grid>
            </Grid>
            {recipients.map((item, index) => (
              <Grid item key={index}>
                <Grid container>
                  <Grid item md={3}>
                    <Typography noWrap>{item.key.toBase58()}</Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography>{item.allocatedTokens.toNumber()}</Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography>{item.claimedTokens.toNumber()}</Typography>
                  </Grid>
                  <Grid item md={3}>
                    <Typography>
                      {item.lastClaimTime.toNumber() == 0
                        ? 0
                        : unixTimestampToDatetimeLocal(
                            item.lastClaimTime.toNumber()
                          )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
        <Typography variant="h6" mt={4}>
          Launch Day:{launchDay}
        </Typography>
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

// YourComponent.js
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from './idl.json'; // Your IDL JSON file

const programID = new PublicKey(idl.metadata.address);
const network = "https://api.devnet.solana.com";

const YourComponent = () => {
  const wallet = useWallet();
  const connection = new Connection(network, 'confirmed');
  const [program, setProgram] = useState(null);
  const [tokenAccount, setTokenAccount] = useState(null);

  useEffect(() => {
    if (wallet.publicKey) {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
      });
      const program = new Program(idl, programID, provider);
      setProgram(program);

      // Fetch or create the token account
      const fetchTokenAccount = async () => {
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          wallet,
          new PublicKey('YourTokenMintPublicKey'),
          wallet.publicKey
        );
        setTokenAccount(tokenAccount.address);
      };

      fetchTokenAccount();
    }
  }, [wallet, connection]);

  const handleInitialize = async () => {
    if (program && wallet.publicKey && tokenAccount) {
      try {
        const [dataAccountPda, dataBump] = await PublicKey.findProgramAddress(
          [Buffer.from('data_account'), programID.toBuffer()],
          program.programId
        );

        const [escrowWalletPda, escrowBump] = await PublicKey.findProgramAddress(
          [Buffer.from('escrow_wallet'), programID.toBuffer()],
          program.programId
        );

        const beneficiaries = [
          {
            key: new PublicKey('BeneficiaryPublicKey1'),
            allocatedTokens: 1000,
            claimedTokens: 0,
            startTime: new web3.BN(Date.now() / 1000),
            lastClaimTime: new web3.BN(Date.now() / 1000),
          },
          // Add more beneficiaries as needed
        ];

        const amount = 1000;
        const decimals = 9;

        await program.rpc.initialize(
          beneficiaries,
          new web3.BN(amount),
          decimals,
          {
            accounts: {
              dataAccount: dataAccountPda,
              escrowWallet: escrowWalletPda,
              walletToWithdrawFrom: tokenAccount,
              tokenMint: new PublicKey('YourTokenMintPublicKey'),
              sender: wallet.publicKey,
              systemProgram: SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
            },
          }
        );
        console.log('Vesting initialized successfully.');
      } catch (error) {
        console.error('Error initializing vesting:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleInitialize} disabled={!wallet.connected || !tokenAccount}>
        Initialize Vesting
      </button>
    </div>
  );
};

export default YourComponent;

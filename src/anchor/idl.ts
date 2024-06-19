export type Vesting = {
  version: "0.1.0";
  name: "vesting";
  instructions: [
    {
      name: "initialize";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "escrowWallet"; isMut: true; isSigner: false },
        { name: "walletToWithdrawFrom"; isMut: true; isSigner: false },
        { name: "tokenMint"; isMut: false; isSigner: false },
        { name: "sender"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "amount"; type: "u64" },
        { name: "decimals"; type: "u8" },
        { name: "launchDay"; type: "i64" },
        { name: "claimPeriod"; type: "i64" },
        { name: "claimRateForLaunchDay"; type: "u8" },
        { name: "claimRatePerDays"; type: "u8" }
      ];
    },
    {
      name: "updateLaunchDay";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "initializer"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false }
      ];
      args: [{ name: "newLaunchDay"; type: "i64" }];
    },
    {
      name: "updateClaimPeriod";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "initializer"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false }
      ];
      args: [{ name: "newClaimPeriod"; type: "i64" }];
    },
    {
      name: "updateClaimRatePerDays";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "initializer"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false }
      ];
      args: [{ name: "newClaimRate"; type: "u8" }];
    },
    {
      name: "updateClaimRateForLaunchday";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "initializer"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false }
      ];
      args: [{ name: "newClaimRate"; type: "u8" }];
    },
    {
      name: "claim";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "escrowWallet"; isMut: true; isSigner: false },
        { name: "sender"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false },
        { name: "walletToDepositTo"; isMut: true; isSigner: false },
        { name: "associatedTokenProgram"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "dataBump"; type: "u8" },
        { name: "walletBump"; type: "u8" },
        { name: "allocatedTokens"; type: "u64" },
        { name: "claimedTokens"; type: "u64" },
        { name: "lastClaimTime"; type: "i64" }
      ];
    },
    {
      name: "addFunds";
      accounts: [
        { name: "walletToWithdrawFrom"; isMut: true; isSigner: false },
        { name: "escrowWallet"; isMut: true; isSigner: false },
        { name: "sender"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "dataBump"; type: "u8" },
        { name: "walletBump"; type: "u8" },
        { name: "amount"; type: "u64" }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        { name: "dataAccount"; isMut: true; isSigner: false },
        { name: "walletToWithdrawFrom"; isMut: true; isSigner: false },
        { name: "escrowWallet"; isMut: true; isSigner: false },
        { name: "sender"; isMut: true; isSigner: true },
        { name: "tokenMint"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "tokenProgram"; isMut: false; isSigner: false }
      ];
      args: [
        { name: "dataBump"; type: "u8" },
        { name: "walletBump"; type: "u8" }
      ];
    }
  ];
  accounts: [
    {
      name: "DataAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "tokenAmount"; type: "u64" },
          { name: "initializer"; type: "publicKey" },
          { name: "escrowWallet"; type: "publicKey" },
          { name: "tokenMint"; type: "publicKey" },
          { name: "decimals"; type: "u8" },
          { name: "launchDay"; type: "i64" },
          { name: "claimPeriod"; type: "i64" },
          { name: "claimRateForLaunchDay"; type: "u8" },
          { name: "claimRatePerDays"; type: "u8" }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidSender";
      msg: "Sender is not owner of Data Account";
    },
    {
      code: 6001;
      name: "ClaimNotAllowed";
      msg: "Not allowed to claim new tokens currently";
    },
    {
      code: 6002;
      name: "NotLaunchDay";
      msg: "The launch day hasn't arrived yet";
    },
    {
      code: 6003;
      name: "NotClaimDay";
      msg: "You already claimed, please wait for more days.";
    }
  ];
};
export const IDL: Vesting = {
  version: "0.1.0",
  name: "vesting",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "escrowWallet", isMut: true, isSigner: false },
        { name: "walletToWithdrawFrom", isMut: true, isSigner: false },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "sender", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "amount", type: "u64" },
        { name: "decimals", type: "u8" },
        { name: "launchDay", type: "i64" },
        { name: "claimPeriod", type: "i64" },
        { name: "claimRateForLaunchDay", type: "u8" },
        { name: "claimRatePerDays", type: "u8" },
      ],
    },
    {
      name: "updateLaunchDay",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "initializer", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
      ],
      args: [{ name: "newLaunchDay", type: "i64" }],
    },
    {
      name: "updateClaimPeriod",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "initializer", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
      ],
      args: [{ name: "newClaimPeriod", type: "i64" }],
    },
    {
      name: "updateClaimRatePerDays",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "initializer", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
      ],
      args: [{ name: "newClaimRate", type: "u8" }],
    },
    {
      name: "updateClaimRateForLaunchday",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "initializer", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
      ],
      args: [{ name: "newClaimRate", type: "u8" }],
    },
    {
      name: "claim",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "escrowWallet", isMut: true, isSigner: false },
        { name: "sender", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "walletToDepositTo", isMut: true, isSigner: false },
        { name: "associatedTokenProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "dataBump", type: "u8" },
        { name: "walletBump", type: "u8" },
        { name: "allocatedTokens", type: "u64" },
        { name: "claimedTokens", type: "u64" },
        { name: "lastClaimTime", type: "i64" },
      ],
    },
    {
      name: "addFunds",
      accounts: [
        { name: "walletToWithdrawFrom", isMut: true, isSigner: false },
        { name: "escrowWallet", isMut: true, isSigner: false },
        { name: "sender", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "dataBump", type: "u8" },
        { name: "walletBump", type: "u8" },
        { name: "amount", type: "u64" },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        { name: "dataAccount", isMut: true, isSigner: false },
        { name: "walletToWithdrawFrom", isMut: true, isSigner: false },
        { name: "escrowWallet", isMut: true, isSigner: false },
        { name: "sender", isMut: true, isSigner: true },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "dataBump", type: "u8" },
        { name: "walletBump", type: "u8" },
      ],
    },
  ],
  accounts: [
    {
      name: "DataAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "tokenAmount", type: "u64" },
          { name: "initializer", type: "publicKey" },
          { name: "escrowWallet", type: "publicKey" },
          { name: "tokenMint", type: "publicKey" },
          { name: "decimals", type: "u8" },
          { name: "launchDay", type: "i64" },
          { name: "claimPeriod", type: "i64" },
          { name: "claimRateForLaunchDay", type: "u8" },
          { name: "claimRatePerDays", type: "u8" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidSender",
      msg: "Sender is not owner of Data Account",
    },
    {
      code: 6001,
      name: "ClaimNotAllowed",
      msg: "Not allowed to claim new tokens currently",
    },
    {
      code: 6002,
      name: "NotLaunchDay",
      msg: "The launch day hasn't arrived yet",
    },
    {
      code: 6003,
      name: "NotClaimDay",
      msg: "You already claimed, please wait for more days.",
    },
  ],
};

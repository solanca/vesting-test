import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './component/header'
import Admin from './component/admin/Admin'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import "@solana/wallet-adapter-react-ui/styles.css"
import NewToken from './component/newtoken/NewToken'
import ProgramProvider from './context/ProgramProvider'
function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
    ],
    [network],
  );
  return (
    <>
<ConnectionProvider endpoint={endpoint}>
<WalletProvider wallets={wallets}>
  <WalletModalProvider>
<ProgramProvider>

     <Header/>
     <Admin/>
</ProgramProvider>
     {/* <NewToken/> */}
  </WalletModalProvider>

</WalletProvider>
</ConnectionProvider>
    </>
  )
}

export default App

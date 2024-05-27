import { AppBar, Box, Toolbar } from '@mui/material'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

type Props = {}

const Header = (_props: Props) => {
  return (
    <AppBar sx={{background:"transparent",boxShadow:"none"}}>
      <Toolbar><Box flexGrow={1}/> <WalletMultiButton/>
        </Toolbar></AppBar>
  )
}

export default Header
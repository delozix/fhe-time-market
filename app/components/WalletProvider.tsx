'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useWallet } from '../hooks/useWallet'
import { useContract } from '../hooks/useContract'
import { useBlockchainProvider } from '../hooks/useBlockchainProvider'
import { useEffect } from 'react'

interface AppContextType {
  wallet: ReturnType<typeof useWallet>
  contract: ReturnType<typeof useContract>
  blockchain: ReturnType<typeof useBlockchainProvider>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet()
  const contract = useContract()
  const blockchain = useBlockchainProvider()

  useEffect(() => {
    console.log('WalletProvider effect triggered:', { 
      hasWalletProvider: !!wallet.provider, 
      hasBlockchainProvider: !!blockchain.provider,
      hasContract: !!contract.contract,
      walletProviderType: wallet.provider?.constructor?.name,
      blockchainProviderType: blockchain.provider?.constructor?.name
    })
    
    // Initialize contract with our blockchain provider (not MetaMask provider)
    if (blockchain.provider && !contract.contract) {
      console.log('Initializing contract with blockchain provider:', blockchain.provider)
      contract.initializeContract(blockchain.provider).then(result => {
        console.log('Contract initialization result:', result)
      }).catch(error => {
        console.error('Contract initialization error:', error)
      })
    }
  }, [blockchain.provider, contract.contract])

  return (
    <AppContext.Provider value={{ wallet, contract, blockchain }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a WalletProvider')
  }
  return context
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

const RPC_OPTIONS = [
  {
    name: '1RPC',
    url: 'https://1rpc.io/sepolia',
    description: 'Free, fast, reliable'
  },
  {
    name: 'DRPC',
    url: 'https://sepolia.drpc.org',
    description: 'High performance'
  },
  {
    name: 'PublicNode',
    url: 'https://ethereum-sepolia-rpc.publicnode.com',
    description: 'Public RPC'
  },
  {
    name: 'Alchemy (Demo)',
    url: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    description: 'Alchemy demo endpoint'
  }
]

export function useBlockchainProvider() {
  const [currentRPC, setCurrentRPC] = useState(RPC_OPTIONS[0])
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize provider
  const initializeProvider = useCallback(async (rpcUrl: string) => {
    try {
      console.log('Initializing blockchain provider with RPC:', rpcUrl)
      setError(null)
      
      const newProvider = new ethers.JsonRpcProvider(rpcUrl)
      
      // Test connection
      const network = await newProvider.getNetwork()
      console.log('Provider network:', network)
      
      if (network.chainId !== BigInt(11155111)) {
        throw new Error(`Wrong network! Expected Sepolia (11155111), got: ${network.chainId}`)
      }
      
      // Test with a simple call
      const blockNumber = await newProvider.getBlockNumber()
      console.log('Provider connection test - Block number:', blockNumber)
      
      setProvider(newProvider)
      setIsConnected(true)
      console.log('✅ Blockchain provider connected successfully')
      
    } catch (err) {
      console.error('❌ Failed to initialize blockchain provider:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setIsConnected(false)
      setProvider(null)
    }
  }, [])

  // Switch RPC
  const switchRPC = useCallback((rpcUrl: string) => {
    const rpcOption = RPC_OPTIONS.find(rpc => rpc.url === rpcUrl)
    if (rpcOption) {
      setCurrentRPC(rpcOption)
      initializeProvider(rpcUrl)
    }
  }, [initializeProvider])

  // Test RPC
  const testRPC = useCallback(async (rpcUrl: string) => {
    try {
      console.log('Testing RPC:', rpcUrl)
      
      const testProvider = new ethers.JsonRpcProvider(rpcUrl)
      const network = await testProvider.getNetwork()
      
      if (network.chainId === BigInt(11155111)) {
        console.log('✅ RPC test successful')
        return { success: true, chainId: network.chainId }
      } else {
        console.log('❌ Wrong network')
        return { success: false, error: 'Wrong network' }
      }
    } catch (error) {
      console.error('❌ RPC test failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    initializeProvider(currentRPC.url)
  }, [initializeProvider, currentRPC.url])

  return {
    provider,
    isConnected,
    error,
    currentRPC,
    switchRPC,
    testRPC,
    rpcOptions: RPC_OPTIONS
  }
}

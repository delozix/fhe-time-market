'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractInfo from '../../contract-info.json'
import { getMockContract } from '../lib/mockContract'

interface ContractState {
  contract: any | null
  loading: boolean
  error: string | null
}

export function useContract() {
  const [state, setState] = useState<ContractState>({
    contract: null,
    loading: true,
    error: null,
  })

  const initializeContract = async (provider: ethers.JsonRpcProvider | ethers.BrowserProvider) => {
    try {
      console.log('=== CONTRACT INITIALIZATION START ===')
      console.log('Contract address:', contractInfo.address)
      console.log('Contract ABI length:', contractInfo.abi.length)
      console.log('Expected network:', contractInfo.network)
      console.log('Provider type:', provider.constructor.name)
      
      // Check if we're on the correct network
      const network = await provider.getNetwork()
      console.log('Current network:', network)
      console.log('Network chainId:', network.chainId)
      console.log('Expected chainId for Sepolia:', BigInt(11155111))
      
      // Check if we're on Sepolia network (any RPC)
      if (contractInfo.network === 'sepolia' && network.chainId !== BigInt(11155111)) {
        console.error('Wrong network! Expected Sepolia (11155111), got:', network.chainId)
        setState({
          contract: null,
          loading: false,
          error: 'Please switch to Sepolia network (Chain ID: 11155111)',
        })
        return null
      }
      
      // Test provider connection
      try {
        const blockNumber = await provider.getBlockNumber()
        console.log('Provider connection test - Block number:', blockNumber)
      } catch (providerError) {
        console.error('Provider connection test failed:', providerError)
        throw providerError
      }
      
      // Use real contract
      const contract = new ethers.Contract(
        contractInfo.address,
        contractInfo.abi,
        provider
      )
      
      console.log('Contract instance created:', contract)
      console.log('Contract target address:', contract.target)
      
      // Test contract connection
      try {
        const owner = await contract.owner()
        console.log('Contract connection test - Owner:', owner)
      } catch (contractError) {
        console.error('Contract connection test failed:', contractError)
        throw contractError
      }
      
      console.log('Contract initialized successfully!')
      console.log('=== CONTRACT INITIALIZATION END ===')
      
      setState({
        contract,
        loading: false,
        error: null,
      })
      
      return contract
    } catch (error) {
      console.error('=== CONTRACT INITIALIZATION ERROR ===')
      console.error('Error details:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : 'No stack trace'
      
      console.error('Error message:', errorMessage)
      console.error('Error stack:', errorStack)
      console.error('=== END ERROR ===')
      
      setState({
        contract: null,
        loading: false,
        error: `Failed to initialize contract: ${errorMessage}`,
      })
      return null
    }
  }

  const loadOffers = async () => {
    console.log('loadOffers called, contract state:', !!state.contract)
    
    if (!state.contract) {
      console.log('Contract not initialized')
      return []
    }

    try {
      console.log('Loading offers...')
      console.log('Contract address:', state.contract.target)
      
      const activeOfferIds = await state.contract.getActiveOffers()
      console.log('Active offer IDs:', activeOfferIds)
      console.log('Active offer IDs length:', activeOfferIds.length)
      
      const offers = []

      for (const offerId of activeOfferIds) {
        console.log('Loading offer:', offerId.toString())
        const offerData = await state.contract.getOffer(offerId)
        console.log('Offer data:', offerData)
        
        offers.push({
          id: offerId.toString(),
          seller: offerData.seller,
          title: offerData.title,
          description: offerData.description,
          price: ethers.formatEther(offerData.price),
          duration: offerData.duration.toString(),
          availableSlots: offerData.availableSlots.toString(),
          isActive: offerData.isActive,
          createdAt: new Date(Number(offerData.createdAt) * 1000),
        })
      }

      console.log('Loaded offers:', offers)
      console.log('Offers count:', offers.length)
      return offers
    } catch (error) {
      console.error('Error loading offers:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', errorMessage)
      return []
    }
  }

  const createOffer = async (
    title: string,
    description: string,
    price: string,
    duration: string,
    availableSlots: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('Contract not initialized')
    
    try {
      console.log('Creating offer with FHE data:', { title, description, price, duration, availableSlots })
      
      const contractWithSigner = state.contract.connect(signer)
      const priceWei = ethers.parseEther(price)
      const durationHours = BigInt(duration)
      const slots = BigInt(availableSlots)

      console.log('Converted values:', { priceWei: priceWei.toString(), durationHours: durationHours.toString(), slots: slots.toString() })

      // For FHE demo, we'll create mock encrypted values as bytes32
      // In production, these would be properly encrypted using FHEVM relayer
      const mockEncryptedPrice = ethers.zeroPadValue(ethers.toBeHex(priceWei), 32)
      const mockEncryptedDuration = ethers.zeroPadValue(ethers.toBeHex(durationHours), 32)
      const mockEncryptedSlots = ethers.zeroPadValue(ethers.toBeHex(slots), 32)

      console.log('Mock encrypted values:', { mockEncryptedPrice, mockEncryptedDuration, mockEncryptedSlots })

      const tx = await contractWithSigner.createOffer(
        title,
        description,
        priceWei,
        durationHours,
        slots,
        mockEncryptedPrice,
        mockEncryptedDuration,
        mockEncryptedSlots
      )

      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)

      return tx.hash
    } catch (error) {
      console.error('Error creating offer:', error)
      throw error
    }
  }

  const purchaseOffer = async (
    offerId: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('Contract not initialized')

    try {
      const contractWithSigner = state.contract.connect(signer)
      
      // Get offer details to get the price
      const offerData = await state.contract.getOffer(offerId)
      
      const tx = await contractWithSigner.purchaseOffer(offerId, {
        value: offerData.price,
      })

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error purchasing offer:', error)
      throw error
    }
  }

  const deactivateOffer = async (
    offerId: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('Contract not initialized')

    try {
      const contractWithSigner = state.contract.connect(signer)
      const tx = await contractWithSigner.deactivateOffer(offerId)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error deactivating offer:', error)
      throw error
    }
  }

  const deleteOffer = async (
    offerId: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('Contract not initialized')

    try {
      const contractWithSigner = state.contract.connect(signer)
      const tx = await contractWithSigner.deleteOffer(offerId)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error deleting offer:', error)
      throw error
    }
  }

  // FHE functions
  const getEncryptedOffer = async (offerId: string) => {
    if (!state.contract) throw new Error('Contract not initialized')
    
    try {
      const offerData = await state.contract.getEncryptedOffer(offerId)
      return offerData
    } catch (error) {
      console.error('Error getting encrypted offer:', error)
      throw error
    }
  }

  const compareEncryptedPrices = async (price1: string, price2: string) => {
    if (!state.contract) throw new Error('Contract not initialized')
    
    try {
      // Mock encrypted values for demo as bytes32
      const mockEncryptedPrice1 = ethers.zeroPadValue(ethers.toBeHex(parseInt(price1)), 32)
      const mockEncryptedPrice2 = ethers.zeroPadValue(ethers.toBeHex(parseInt(price2)), 32)
      
      const result = await state.contract.compareEncryptedPrices(mockEncryptedPrice1, mockEncryptedPrice2)
      return result
    } catch (error) {
      console.error('Error comparing encrypted prices:', error)
      throw error
    }
  }

  const isEncryptedPriceGreaterThan = async (price: string, threshold: number) => {
    if (!state.contract) throw new Error('Contract not initialized')
    
    try {
      // Mock encrypted value for demo as bytes32
      const mockEncryptedPrice = ethers.zeroPadValue(ethers.toBeHex(parseInt(price)), 32)
      
      const result = await state.contract.isEncryptedPriceGreaterThan(mockEncryptedPrice, threshold)
      return result
    } catch (error) {
      console.error('Error checking encrypted price:', error)
      throw error
    }
  }

  // Get contract statistics
  const getContractStats = async () => {
    if (!state.contract) throw new Error('Contract not initialized')
    
    try {
      const stats = await state.contract.getContractStats()
      return {
        totalOffers: stats[0].toString(),
        totalPurchases: stats[1].toString(),
        totalVolume: ethers.formatEther(stats[2]) + " ETH",
        activeOffers: stats[3].toString(),
        fheEnabled: stats[4]
      }
    } catch (error) {
      console.error('Error getting contract stats:', error)
      throw error
    }
  }

  return {
    ...state,
    initializeContract,
    loadOffers,
    createOffer,
    purchaseOffer,
    deactivateOffer,
    deleteOffer,
    getEncryptedOffer,
    compareEncryptedPrices,
    isEncryptedPriceGreaterThan,
    getContractStats,
  }
}

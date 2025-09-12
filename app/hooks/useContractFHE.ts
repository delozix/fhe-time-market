'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractInfo from '../../contract-info.json'
import { FHEUtils } from '../lib/fhe-relayer'

interface FHEContractState {
  contract: any | null
  loading: boolean
  error: string | null
  publicKey: string | null
}

export function useContractFHE() {
  const [state, setState] = useState<FHEContractState>({
    contract: null,
    loading: true,
    error: null,
    publicKey: null,
  })

  const initializeContract = async (provider: ethers.JsonRpcProvider | ethers.BrowserProvider) => {
    try {
      console.log('=== FHE CONTRACT INITIALIZATION START ===')
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
          publicKey: null,
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
      
      // Use FHE contract
      const contract = new ethers.Contract(
        contractInfo.address,
        contractInfo.abi,
        provider
      )
      
      console.log('FHE Contract instance created:', contract)
      console.log('Contract target address:', contract.target)
      
      // Get the public key from the contract
      let publicKey = null
      try {
        publicKey = await contract.publicKey()
        console.log('Contract public key:', publicKey)
      } catch (publicKeyError) {
        console.error('Failed to get public key:', publicKeyError)
        // For demo purposes, generate a mock public key
        publicKey = FHEUtils.generateMockPublicKey()
        console.log('Using mock public key:', publicKey)
      }
      
      // Test contract connection
      try {
        const owner = await contract.owner()
        console.log('Contract connection test - Owner:', owner)
      } catch (contractError) {
        console.error('Contract connection test failed:', contractError)
        throw contractError
      }
      
      console.log('FHE Contract initialized successfully!')
      console.log('=== FHE CONTRACT INITIALIZATION END ===')
      
      setState({
        contract,
        loading: false,
        error: null,
        publicKey,
      })
      
      return contract
    } catch (error) {
      console.error('=== FHE CONTRACT INITIALIZATION ERROR ===')
      console.error('Error details:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : 'No stack trace'
      
      console.error('Error message:', errorMessage)
      console.error('Error stack:', errorStack)
      console.error('=== END ERROR ===')
      
      setState({
        contract: null,
        loading: false,
        error: `Failed to initialize FHE contract: ${errorMessage}`,
        publicKey: null,
      })
      return null
    }
  }

  const loadOffers = async () => {
    console.log('loadOffers called, FHE contract state:', !!state.contract)
    
    if (!state.contract) {
      console.log('FHE Contract not initialized')
      return []
    }

    try {
      console.log('Loading encrypted offers...')
      console.log('Contract address:', state.contract.target)
      
      const activeOfferIds = await state.contract.getActiveOffers()
      console.log('Active offer IDs:', activeOfferIds)
      console.log('Active offer IDs length:', activeOfferIds.length)
      
      const offers = []

      for (const offerId of activeOfferIds) {
        console.log('Loading encrypted offer:', offerId.toString())
        const offerData = await state.contract.getEncryptedOffer(offerId)
        console.log('Encrypted offer data:', offerData)
        
        // For demo purposes, we'll create mock decrypted data
        // In a real implementation, you would decrypt the encrypted values
        const mockPrice = Math.floor(Math.random() * 1000) + 100 // Mock price in wei
        const mockDuration = Math.floor(Math.random() * 24) + 1 // Mock duration in hours
        const mockSlots = Math.floor(Math.random() * 10) + 1 // Mock available slots
        
        offers.push({
          id: offerId.toString(),
          seller: offerData.seller,
          title: offerData.title,
          description: offerData.description,
          price: ethers.formatEther(mockPrice.toString()), // Mock decrypted price
          duration: mockDuration.toString(), // Mock decrypted duration
          availableSlots: mockSlots.toString(), // Mock decrypted slots
          isActive: true, // Mock decrypted active status
          createdAt: new Date(Number(offerData.createdAt) * 1000),
          encryptedPrice: offerData.encryptedPrice, // Keep encrypted data for FHE operations
          encryptedDuration: offerData.encryptedDuration,
          encryptedAvailableSlots: offerData.encryptedAvailableSlots,
          encryptedIsActive: offerData.encryptedIsActive,
        })
      }

      console.log('Loaded encrypted offers:', offers)
      console.log('Offers count:', offers.length)
      return offers
    } catch (error) {
      console.error('Error loading encrypted offers:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', errorMessage)
      return []
    }
  }

  const createEncryptedOffer = async (
    title: string,
    description: string,
    price: string,
    duration: string,
    availableSlots: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('FHE Contract not initialized')
    
    try {
      console.log('Creating encrypted offer with data:', { title, description, price, duration, availableSlots })
      
      // Encrypt the data using FHE
      const encryptedPrice = await FHEUtils.encryptUint32(parseInt(ethers.parseEther(price).toString()))
      const encryptedDuration = await FHEUtils.encryptUint32(parseInt(duration))
      const encryptedSlots = await FHEUtils.encryptUint32(parseInt(availableSlots))
      
      console.log('Encrypted values:', { 
        encryptedPrice, 
        encryptedDuration, 
        encryptedSlots 
      })
      
      const contractWithSigner = state.contract.connect(signer)
      
      const tx = await contractWithSigner.createEncryptedOffer(
        title,
        description,
        encryptedPrice,
        encryptedDuration,
        encryptedSlots
      )

      console.log('Encrypted offer transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Encrypted offer transaction confirmed:', receipt)

      return tx.hash
    } catch (error) {
      console.error('Error creating encrypted offer:', error)
      throw error
    }
  }

  const purchaseEncryptedOffer = async (
    offerId: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('FHE Contract not initialized')

    try {
      const contractWithSigner = state.contract.connect(signer)
      
      // For demo purposes, we'll use a fixed price
      // In a real implementation, you would need to decrypt the price first
      const mockPrice = ethers.parseEther("0.01") // Mock price for demo
      
      const tx = await contractWithSigner.purchaseEncryptedOffer(offerId, {
        value: mockPrice,
      })

      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error purchasing encrypted offer:', error)
      throw error
    }
  }

  const deactivateEncryptedOffer = async (
    offerId: string,
    signer: ethers.JsonRpcSigner
  ) => {
    if (!state.contract) throw new Error('FHE Contract not initialized')

    try {
      const contractWithSigner = state.contract.connect(signer)
      const tx = await contractWithSigner.deactivateEncryptedOffer(offerId)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error deactivating encrypted offer:', error)
      throw error
    }
  }

  // FHE comparison functions
  const compareEncryptedPrices = async (price1: string, price2: string) => {
    if (!state.contract) throw new Error('FHE Contract not initialized')
    
    try {
      const encryptedPrice1 = await FHEUtils.encryptUint32(parseInt(price1))
      const encryptedPrice2 = await FHEUtils.encryptUint32(parseInt(price2))
      
      const result = await state.contract.compareEncryptedPrices(encryptedPrice1, encryptedPrice2)
      return result
    } catch (error) {
      console.error('Error comparing encrypted prices:', error)
      throw error
    }
  }

  return {
    ...state,
    initializeContract,
    loadOffers,
    createEncryptedOffer,
    purchaseEncryptedOffer,
    deactivateEncryptedOffer,
    compareEncryptedPrices,
  }
}

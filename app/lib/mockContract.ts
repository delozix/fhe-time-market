// Mock contract for testing without blockchain
class MockContract {
  private offers: any[] = []
  private nextId = 1

  constructor() {
    // Start with empty offers array
    this.offers = []
  }

  async getActiveOffers() {
    console.log('Mock: Getting active offers')
    return this.offers.filter(offer => offer.isActive).map(offer => offer.id)
  }

  async getOffer(offerId: any) {
    console.log('Mock: Getting offer', offerId.toString())
    const offer = this.offers.find(o => o.id === Number(offerId))
    if (!offer) throw new Error('Offer not found')
    return offer
  }

  async createOffer(title: string, description: string, price: any, duration: any, availableSlots: any, options: any) {
    console.log('Mock: Creating offer', { title, description, price: price.toString(), duration: duration.toString(), availableSlots: availableSlots.toString() })
    
    const offer = {
      id: this.nextId++,
      seller: '0x1234567890123456789012345678901234567890', // Mock seller address
      title,
      description,
      price,
      duration,
      availableSlots,
      isActive: true,
      createdAt: Math.floor(Date.now() / 1000)
    }
    
    this.offers.push(offer)
    console.log('Mock: Offer created', offer)
    
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      wait: async () => ({ status: 1 })
    }
  }

  async purchaseOffer(offerId: any, options: any) {
    console.log('Mock: Purchasing offer', offerId.toString())
    const offer = this.offers.find(o => o.id === Number(offerId))
    if (!offer) throw new Error('Offer not found')
    
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      wait: async () => ({ status: 1 })
    }
  }

  async deactivateOffer(offerId: any) {
    console.log('Mock: Deactivating offer', offerId.toString())
    const offer = this.offers.find(o => o.id === Number(offerId))
    if (offer) {
      offer.isActive = false
    }
    
    return {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      wait: async () => ({ status: 1 })
    }
  }
}

// Singleton instance
let mockContractInstance: MockContract | null = null

export function getMockContract(): MockContract {
  if (!mockContractInstance) {
    mockContractInstance = new MockContract()
  }
  return mockContractInstance
}

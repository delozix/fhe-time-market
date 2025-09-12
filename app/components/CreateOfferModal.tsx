'use client'

import { useState } from 'react'
import { X, Clock, DollarSign, Users, FileText } from 'lucide-react'
import { useAppContext } from './WalletProvider'
import toast from 'react-hot-toast'

interface CreateOfferModalProps {
  onClose: () => void
  onOfferCreated: () => void
}

export function CreateOfferModal({ onClose, onOfferCreated }: CreateOfferModalProps) {
  const { wallet, contract } = useAppContext()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    availableSlots: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!wallet.signer) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setIsSubmitting(true)
      
      await contract.createOffer(
        formData.title,
        formData.description,
        formData.price,
        formData.duration,
        formData.availableSlots,
        wallet.signer
      )

      toast.success('Offer created successfully!')
      
      // Wait a bit for the blockchain to update
      setTimeout(() => {
        onOfferCreated()
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create offer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create Time Offer</h2>
            <button
              onClick={onClose}
              className="p-2 text-dark-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 1-hour coding session"
                className="input"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you're offering..."
                rows={4}
                className="input resize-none"
                required
              />
            </div>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Price (ETH)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.01"
                  step="0.001"
                  min="0"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Available Slots */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Available Slots
              </label>
              <input
                type="number"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={handleChange}
                placeholder="5"
                min="1"
                className="input"
                required
              />
            </div>

            {/* FHE Notice */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-xs font-bold">FHE</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary-400 mb-1">
                    Fully Homomorphic Encryption
                  </h4>
                  <p className="text-xs text-dark-300">
                    Your offer data will be encrypted using FHE technology, ensuring privacy while maintaining functionality.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

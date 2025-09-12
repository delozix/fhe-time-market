import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from './components/WalletProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Time Marketplace - FHE Powered',
  description: 'Decentralized time marketplace with fully homomorphic encryption',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#3d3d3d',
                color: '#f6f6f6',
                border: '1px solid #facc15',
              },
            }}
          />
        </WalletProvider>
      </body>
    </html>
  )
}


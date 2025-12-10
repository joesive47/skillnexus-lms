'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Flame, Gift, Zap, Crown } from 'lucide-react'

interface RewardPopupProps {
  show: boolean
  onClose: () => void
  reward: {
    type: 'xp' | 'level' | 'achievement' | 'streak' | 'daily'
    amount?: number
    title: string
    description: string
    special?: boolean
  }
}

export default function RewardPopup({ show, onClose, reward }: RewardPopupProps) {
  const getIcon = () => {
    switch (reward.type) {
      case 'xp': return <Zap className="w-8 h-8 text-yellow-400" />
      case 'level': return <Crown className="w-8 h-8 text-purple-400" />
      case 'achievement': return <Trophy className="w-8 h-8 text-gold-400" />
      case 'streak': return <Flame className="w-8 h-8 text-orange-400" />
      case 'daily': return <Gift className="w-8 h-8 text-blue-400" />
      default: return <Star className="w-8 h-8 text-yellow-400" />
    }
  }

  const getBackgroundGradient = () => {
    switch (reward.type) {
      case 'xp': return 'from-yellow-500 to-orange-500'
      case 'level': return 'from-purple-500 to-pink-500'
      case 'achievement': return 'from-yellow-600 to-orange-600'
      case 'streak': return 'from-orange-500 to-red-500'
      case 'daily': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-gradient-to-br ${getBackgroundGradient()} p-8 rounded-2xl shadow-2xl max-w-md w-full text-white text-center relative overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="mb-6 flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                {getIcon()}
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">{reward.title}</h2>

            {reward.amount && (
              <div className="text-4xl font-bold mb-4">
                +{reward.amount} {reward.type.toUpperCase()}
              </div>
            )}

            <p className="text-white/90 mb-6">{reward.description}</p>

            {reward.special && (
              <div className="mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Special Reward!</span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 rounded-full font-semibold transition-all duration-200"
            >
              Awesome! 🎉
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
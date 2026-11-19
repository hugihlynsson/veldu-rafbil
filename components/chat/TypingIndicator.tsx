'use client'

import React from 'react'
import TypingDots from '@/components/TypingDots'

const TypingIndicator: React.FunctionComponent = () => (
  <TypingDots
    label="Skrifar svar"
    className="animate-message-in mb-4 scroll-mt-5 px-5"
  />
)

export default TypingIndicator

'use client'

import React from 'react'
import { colors } from '../../modules/globals'

const TypingIndicator: React.FunctionComponent = () => {
  return (
    <div className="message assistant">
      <div className="message-content typing">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <style jsx>{`
        .message {
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease-in-out;
          margin-bottom: 16px;
          scroll-margin-top: 20px;
        }
        .message.assistant {
          align-items: flex-start;
        }

        .message-content {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          background-color: ${colors.cloud};
          color: ${colors.tint};
        }

        .typing {
          display: flex;
          gap: 4px;
          padding: 14px 16px;
        }
        .typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${colors.clay};
          animation: typing 1.4s infinite;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}

export default TypingIndicator

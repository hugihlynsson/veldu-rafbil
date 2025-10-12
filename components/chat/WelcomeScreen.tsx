'use client'

import React from 'react'
import { colors } from '../../modules/globals'

interface Props {
  suggestions: string[]
  onSendMessage: (message: string) => void
}

const WelcomeScreen: React.FunctionComponent<Props> = ({
  suggestions,
  onSendMessage,
}) => {
  return (
    <div className="welcome">
      <p className="welcome-title">Hæ! Ég get hjálpað þér með spurningar um rafbíla.</p>
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-button"
            onClick={() => onSendMessage(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <style jsx>{`
        .welcome {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px 0;
          align-items: center;
        }
        .welcome-title {
          margin: 0;
          color: ${colors.tint};
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          text-wrap: pretty;
        }
        .suggestions-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 500px;
        }
        .suggestion-button {
          appearance: none;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13px;
          font-weight: 500;
          color: ${colors.tint};
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          line-height: 1.4;
          width: fit-content;
        }
        .suggestion-button:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .suggestion-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  )
}

export default WelcomeScreen

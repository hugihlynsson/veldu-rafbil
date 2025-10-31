'use client'

import React from 'react'
import { colors } from '../../modules/globals'

interface Props {
  suggestions: string[]
  onSendMessage: (message: string) => void
}

const FollowUpSuggestions: React.FunctionComponent<Props> = ({
  suggestions,
  onSendMessage,
}) => {
  return (
    <div className="follow-up-suggestions">
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-button"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => onSendMessage(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <style jsx>{`
        .follow-up-suggestions {
          padding: 0px 0 8px 0;
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
          opacity: 0;
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default FollowUpSuggestions

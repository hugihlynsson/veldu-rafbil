'use client'

import React from 'react'
import { colors } from '../../modules/globals'

interface Props {
  hasMessages: boolean
  onClose: () => void
  onClearChat: () => void
}

const ChatHeader: React.FunctionComponent<Props> = ({
  hasMessages,
  onClose,
  onClearChat,
}) => {
  return (
    <header>
      <button onClick={onClose} className="close">
        <svg
          width="14"
          height="14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <title>Close</title>
          <path
            d="m2.07 13.12 4.78-4.78 4.93 4.93 1.29-1.29-4.93-4.93 4.78-4.78L11.64.98 6.85 5.77 1.91.83.63 2.1l4.94 4.94-4.79 4.79 1.29 1.28Z"
            fill={colors.stone}
          />
        </svg>
      </button>
      Spjall
      {hasMessages && (
        <button onClick={onClearChat} className="clear-chat">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Hreinsa spjall</title>
            <path
              d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <style jsx>{`
        header {
          position: relative;
          font-size: 18px;
          text-align: center;
          padding: 16px;
          box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.05);
          font-weight: 600;
        }

        .close {
          position: absolute;
          left: 11px;
          top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border: 0;
          padding: 0;
          border-radius: 16px;
          appearance: none;
          background-color: transparent;
          font-size: 30px;
          color: ${colors.stone};
          cursor: pointer;
          transition: all 0.2s;
        }
        .close:hover {
          background-color: ${colors.cloud};
        }
        .close path {
          transition: all 0.2s;
        }
        .close:hover path {
          fill: ${colors.tint};
        }

        .clear-chat {
          position: absolute;
          right: 11px;
          top: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          width: 32px;
          border: 0;
          padding: 0;
          border-radius: 16px;
          appearance: none;
          background-color: transparent;
          color: ${colors.stone};
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-chat:hover {
          background-color: ${colors.cloud};
          color: ${colors.tint};
        }
      `}</style>
    </header>
  )
}

export default ChatHeader

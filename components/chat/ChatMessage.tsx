'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from '../../modules/globals'
import { UIDataTypes, UITools, UIMessage } from 'ai'
import { useEffect } from 'react'
import { useRef } from 'react'
import { stripFollowUps } from '../../utils/chatHelpers'

interface Props {
  message: UIMessage<unknown, UIDataTypes, UITools>
  isLastUserMessage: boolean
}

const ChatMessage: React.FunctionComponent<Props> = ({
  message,
  isLastUserMessage,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLastUserMessage) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
    >
      <div className="message-content">
        {message.parts?.map((part, index) =>
          part.type === 'text' ? (
            <ReactMarkdown
              key={index}
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="table-wrapper">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {stripFollowUps(part.text)}
            </ReactMarkdown>
          ) : null,
        )}
      </div>

      <style jsx>{`
        .message {
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.3s ease-in-out;
          margin-bottom: 16px;
          scroll-margin-top: 20px;
        }
        .message.user {
          align-items: flex-end;
        }
        .message.assistant {
          align-items: flex-start;
        }
        .message:nth-last-child(2) {
          margin-bottom: 0;
        }

        .message-content {
          max-width: 90%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .message.user .message-content {
          background-color: ${colors.sky};
          color: ${colors.lab};
        }
        .message.assistant .message-content {
          background-color: ${colors.cloud};
          color: ${colors.tint};
        }

        /* Markdown styling */
        .message-content :global(p) {
          margin: 0 0 0.5em 0;
        }
        .message-content :global(p:last-child) {
          margin-bottom: 0;
        }
        .message-content :global(strong) {
          font-weight: 600;
        }
        .message-content :global(em) {
          font-style: italic;
        }
        .message-content :global(code) {
          background-color: rgba(0, 0, 0, 0.06);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.9em;
        }
        .message-content :global(pre) {
          background-color: rgba(0, 0, 0, 0.06);
          padding: 8px 10px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 0.5em 0;
        }
        .message-content :global(pre code) {
          background-color: transparent;
          padding: 0;
        }
        .message-content :global(ul),
        .message-content :global(ol) {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        .message-content :global(li) {
          margin: 0.25em 0;
        }
        .message-content :global(a) {
          color: inherit;
          text-decoration: underline;
        }
        .message-content :global(a:hover) {
          opacity: 0.8;
        }
        .message-content :global(.table-wrapper) {
          overflow-x: auto;
          margin: 0.5em -14px;
          padding: 0 14px;
          -webkit-overflow-scrolling: touch;
        }
        .message-content :global(table) {
          border-collapse: collapse;
          width: 100%;
          font-size: 13px;
        }
        .message-content :global(th),
        .message-content :global(td) {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 6px 8px;
          text-align: left;
        }
        .message-content :global(th) {
          background-color: rgba(0, 0, 0, 0.04);
          font-weight: 600;
        }
        .message-content :global(tr:nth-child(even)) {
          background-color: rgba(0, 0, 0, 0.02);
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
      `}</style>
    </div>
  )
}

export default ChatMessage

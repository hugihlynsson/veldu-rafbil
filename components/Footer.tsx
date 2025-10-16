"use client"

import { FunctionComponent } from 'react'

import { colors } from '../modules/globals'
import Orflaedi from './Orflaedi'

const Footer: FunctionComponent<{}> = () => (
  <>
    <Orflaedi />
    <footer>
      <p className="footer-text">
        Veldu Rafbíl er smíðuð af{' '}
        <a href="https://hugihlynsson.com">Huga Hlynssyni</a> og er geymd á{' '}
        <a href="https://github.com/hugihlynsson/veldu-rafbil">GitHub</a>.{' '}
      </p>

      <p className="footer-text">
        Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{' '}
        <a href="mailto:hugi@hey.com">hugi@hey.com</a>.
      </p>

      <style jsx>{`
        footer {
          background-color: #f8f8f8;
          padding: 32px 0 100px;
        }
        p {
          margin: 0 auto;
          max-width: 480px;
          font-size: 14px;
          line-height: 1.5;
          padding: 0 16px;
          color: ${colors.stone};
        }
        a {
          color: ${colors.tint};
          font-weight: 600;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        @media screen and (min-width: 375px) {
          footer {
            padding: 56px 0 100px;
          }
          p {
            padding: 0 24px;
          }
        }

        @media screen and (min-width: 768px) {
          footer {
            padding: 56px 0 100px;
          }
          p {
            max-width: 1024px;
            padding: 0 40px;
          }
        }
      `}</style>
    </footer>
  </>
)

export default Footer

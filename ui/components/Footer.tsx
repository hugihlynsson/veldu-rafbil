export default () => (
  <footer>
    <p>
      Veldu Rafbíl er smíðuð af{' '}
      <a href="https://hugihlynsson.com">Huga Hlynssyni</a> og er geymd á{' '}
      <a href="https://github.com/hugihlynsson/veldu-rafbil">GitHub</a>.{' '}
    </p>

    <p>
      Ef þú ert með ábendingu eða fyrirspurn geturu sent póst á{' '}
      <a href="mailto:hugihlynsson@gmail.com">hugihlynsson@gmail.com</a>.
    </p>

    <style jsx>
      {`
        footer {
          background-color: #F8F8F8;
          padding: 32px 16px;
        }
        footer p {
          margin 0 auto;
          max-width: 480px;
          font-size: 14px;
          line-height: 1.5;
          font-weight: 300;
        }
        footer a {
          color: #000;
          font-weight: 500;
          text-decoration: none;
        }
        footer a:hover {
          text-decoration: underline;
        }

        @media screen and (min-width: 375px) {
          footer {
            padding: 56px 24px;
          }
        }

        @media screen and (min-width: 768px) {
          footer {
            padding: 56px 40px;
          }
          footer p {
            max-width: calc(1024px - 40px - 40px);
            margin: 0 auto;
          }
        }
      `}
    </style>
  </footer>
)

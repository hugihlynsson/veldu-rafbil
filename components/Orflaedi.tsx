import { FunctionComponent } from 'react'

import { colors } from '../modules/globals'

const Orflaedi: FunctionComponent<{}> = () => (
  <section>
    <div className="content">
      <div className="texts">
        <h1>Ertu að leita að enn hagkvæmara ökutæki?</h1>

        <p>
          <a href="https://www.orflaedi.is">Örflæði.is</a> er einfalt yfirlit
          yfir öll rafhjól og örflæðistæki sem eru í boði á Íslandi. Þar hefur
          Jökull Sólberg, áhugamaður um samgöngur, flokkað öll tækin eftir því
          hvar þau eru í umferðarlögunum, klippt til myndir og tekið saman
          helstu tækniupplýsingarnar.
        </p>
      </div>

      <a href="https://www.orflaedi.is" className="card">
        Öll létt rafknúin ökutæki á einum stað
        <img
          width="151"
          height="30"
          alt="Örflæði logo"
          src="/orflaedi-logo.svg"
        />
      </a>
    </div>

    <style jsx>{`
      section {
        background-color: #e2e8f0;
        margin-bottom: 2px;
      }
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        padding: 32px 16px;
      }
      .texts {
        margin-bottom: 24px;
      }
      h1 {
        margin: 0 0 20px 0;
        font-weight: 900;
        font-size: 32px;
        max-width: 480px;
        line-height: 1.1;
        color: ${colors.tint};
      }
      p {
        margin: 0;
        max-width: 480px;
        font-size: 14px;
        line-height: 1.5;
        color: ${colors.stone};
      }
      p a {
        color: #000;
        font-weight: 500;
        text-decoration: none;
      }

      p a:hover {
        text-decoration: underline;
      }
      .card {
        flex-shrink: 0;
        display: block;
        max-width: 320px;
        background-color: #1a202c;
        border-radius: 16px;
        padding: 24px;
        padding-right: 64px;
        box-shadow: 0 2px 32px rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
        color: white;
        path: white !important;
        text-decoration: none;
        font-size: 20px;
        line-height: 1.4;
        font-weight: 600;
      }
      .card:hover {
        box-shadow: 0 8px 64px rgba(0, 0, 0, 0.3);
        transform: translateY(-4px);
      }
      .card img {
        display: block;
        height: auto;
        max-width: 100%;
        height: 30px;
        margin-top: 40px;
      }

      @media screen and (min-width: 375px) {
        .content {
          max-width: 480px;
          padding: 56px 24px;
        }
      }

      @media screen and (min-width: 768px) {
        .content {
          padding: 56px 40px;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          max-width: 1024px;
        }
        .texts {
          margin-bottom: 0;
          margin-right: 32px;
        }
      }
    `}</style>
  </section>
)

export default Orflaedi

import { FunctionComponent } from 'react'

const Orflaedi: FunctionComponent<{}> = () => (
  <section className="bg-[#e2e8f0] mb-0.5">
    <div className="flex flex-col items-center mx-auto py-8 px-4 xs:max-w-[480px] xs:py-14 xs:px-6 md:py-14 md:px-10 md:flex-row md:justify-between md:items-center md:max-w-[1024px]">
      <div className="mb-6 md:mb-0 md:mr-8">
        <h1 className="m-0 mb-5 font-black text-[32px] max-w-[480px] leading-[1.1] text-tint">
          Ertu að leita að enn hagkvæmara ökutæki?
        </h1>

        <p className="m-0 max-w-[480px] text-sm leading-6 text-stone">
          <a
            href="https://www.orflaedi.is"
            className="text-black font-medium no-underline hover:underline"
          >
            Örflæði.is
          </a>{' '}
          er einfalt yfirlit yfir öll rafhjól og örflæðistæki sem eru í boði á
          Íslandi. Þar hefur Jökull Sólberg, áhugamaður um samgöngur, flokkað
          öll tækin eftir því hvar þau eru í umferðarlögunum, klippt til myndir
          og tekið saman helstu tækniupplýsingarnar.
        </p>
      </div>

      <a
        href="https://www.orflaedi.is"
        className="shrink-0 block max-w-[320px] bg-[#1a202c] rounded-2xl p-6 pr-16 shadow-[0_2px_32px_rgba(0,0,0,0.2)] transition-all duration-200 text-white no-underline text-xl leading-[1.4] font-semibold hover:shadow-[0_8px_64px_rgba(0,0,0,0.3)] hover:-translate-y-1"
      >
        Öll létt rafknúin ökutæki á einum stað
        <img
          width="151"
          height="30"
          alt="Örflæði logo"
          src="/orflaedi-logo.svg"
          className="block max-w-full h-[30px] mt-10"
        />
      </a>
    </div>
  </section>
)

export default Orflaedi

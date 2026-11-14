import cars from '@/modules/data/cars'
import { grantAmountText, grantCeilingText } from '@/modules/copy/grantCopy'
import { listLead } from '@/modules/copy/listHeadline'
import TextLink from '@/components/TextLink'

export default function Intro() {
  return (
    <p className="leading-5.5 text-sm pt-6 m-0 mb-8 text-stone max-w-[33em] text-pretty md:text-base md:leading-6">
      {listLead(cars.length)}, með verði, drægni og hleðsluhraða hlið við hlið.
      Raðaðu og síaðu listann, berðu bíla saman eða spurðu Veldu Rafbíl ef þú
      veist ekki hvar þú átt að byrja.
      <span className="inline-block text-xs text-stone mt-2">
        Kaupendur nýskráðra rafbíla sem kosta minna en {grantCeilingText} eiga
        kost á að{' '}
        <TextLink href="https://island.is/rafbilastyrkir">
          sækja um {grantAmountText} rafbílastyrk
        </TextLink>
        .
      </span>
    </p>
  )
}

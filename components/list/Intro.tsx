import cars from '@/modules/data/cars'
import { grantAmountText, grantCeilingText } from '@/modules/copy/grantCopy'
import TextLink from '@/components/TextLink'

export default function Intro() {
  return (
    <p className="leading-6 text-sm pt-6 m-0 mb-8 text-stone max-w-[33em] text-pretty md:text-base">
      Listi yfir alla {cars.length} bílana sem eru seldir á Íslandi og eru 100%
      rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
      <TextLink href="http://wltpfacts.eu/">WLTP</TextLink> mælingum frá
      framleiðenda en raundrægni er háð aðstæðum og aksturslagi.
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

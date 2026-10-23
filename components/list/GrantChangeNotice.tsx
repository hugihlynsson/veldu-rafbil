import {
  grantAmountText,
  nextGrantAmountText,
  nextGrantCeilingText,
  nextGrantStartText,
} from '@/modules/copy/grantCopy'
import TextLink from '@/components/TextLink'

export default function GrantChangeNotice() {
  return (
    <p className="leading-6 text-sm m-0 -mt-4 mb-8 px-4 py-3 rounded-card bg-cloud text-tint max-w-[33em] text-pretty">
      <strong>Rafbílastyrkurinn lækkar {nextGrantStartText}.</strong> Umsóknir
      sem eru samþykktar þann dag eða síðar fá {nextGrantAmountText} í stað{' '}
      {grantAmountText} og bílar sem kosta meira en {nextGrantCeilingText} fá
      engan styrk. Aðeins er hægt að sækja um eftir nýskráningu, svo til að fá
      núverandi styrk þarf bíllinn að vera nýskráður og umsóknin samþykkt fyrir
      mánaðamót. Verð væntanlegra bíla miðast þegar við nýja styrkinn.{' '}
      <TextLink href="https://island.is/rafbilastyrkir">
        Nánar á island.is
      </TextLink>
    </p>
  )
}

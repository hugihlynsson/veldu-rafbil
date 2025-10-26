'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useChat } from '@ai-sdk/react'
import Car, { getPriceWithGrant } from '../components/NewCar'
import Title from '../components/Title'
import Toggles from '../components/Toggles'
import FilterModal from '../components/FilterModal'
import ChatModal from '../components/ChatModal'
import FloatingChat from '../components/FloatingChat'
import newCars from '../modules/newCars'
import addDecimalSeprators from '../modules/addDecimalSeparators'
import getKmPerMinutesCharged from '../modules/getKmPerMinutesCharged'
import { colors } from '../modules/globals'
import { NewCar, Filters, Sorting } from '../types'
import { carSorter, sortingToQuery } from '../modules/sorting'
import stableSort from '../modules/stableSort'

const carFilter =
  (filters: Filters) =>
  (car: NewCar): boolean => {
    if (Object.keys(filters).length === 0) return true
    return Object.keys(filters).every((name): boolean => {
      switch (name as keyof Filters) {
        case 'acceleration':
          return (
            car.acceleration <=
            (filters.acceleration ?? Number.MAX_SAFE_INTEGER)
          )
        case 'availability':
          return (
            Boolean(car.expectedDelivery) ===
            (filters.availability === 'expected')
          )
        case 'drive':
          return filters.drive?.includes(car.drive) || false
        case 'fastcharge':
          return (
            Number(getKmPerMinutesCharged(car.timeToCharge10T080, car.range)) >=
            (filters.fastcharge ?? 0)
          )
        case 'name':
          return (
            filters.name?.some((nameFilter) =>
              `${car.make} ${car.model} ${car.subModel}`
                .toLowerCase()
                .includes(nameFilter.toLowerCase()),
            ) || false
          )
        case 'price':
          return (
            getPriceWithGrant(car.price) <=
            (filters.price ?? Number.MAX_SAFE_INTEGER)
          )
        case 'range':
          return car.range >= (filters.range ?? 0)
        case 'value':
          return (
            getPriceWithGrant(car.price) / car.range <=
            (filters.value ?? Number.MAX_SAFE_INTEGER)
          )
      }
    })
  }

const useBodyScrollLock = (lock: boolean): void => {
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    setScrollY(window.scrollY)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (lock) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      window.scrollTo(0, parseInt(scrollY) * -1)
    }
  }, [lock])
}

const useSorting = (initial: Sorting) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sorting, setSorting] = useState<Sorting>(initial)

  useEffect(() => {
    let updatedSearchParams = new URLSearchParams(searchParams)

    sorting === 'name'
      ? updatedSearchParams.delete('radaeftir')
      : updatedSearchParams.set('radaeftir', sortingToQuery[sorting])

    router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
      scroll: false,
    })
  }, [sorting])

  return [sorting, setSorting] as const
}

const useFilters = (initial: Filters) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>(initial)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    let {
      name,
      acceleration,
      availability,
      drive,
      fastcharge,
      price,
      range,
      value,
    } = filters

    name ? params.set('nafn', name.join(',')) : params.delete('nafn')
    acceleration
      ? params.set('hrodun', acceleration.toString())
      : params.delete('hrodun')
    availability
      ? params.set(
          'frambod',
          availability === 'available' ? 'faanlegir' : 'vaentanlegir',
        )
      : params.delete('frambod')
    drive ? params.set('drif', drive.join(',')) : params.delete('drif')
    fastcharge
      ? params.set('hradhledsla', fastcharge.toString())
      : params.delete('hradhledsla')
    price ? params.set('verd', price.toString()) : params.delete('verd')
    range ? params.set('draegni', range.toString()) : params.delete('draegni')
    value ? params.set('virdi', value.toString()) : params.delete('virdi')

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [filters])

  return [filters, setFilters] as const
}

interface Props {
  sorting: Sorting
  filters: Filters
}

const CHAT_STORAGE_KEY = 'veldu-rafbil-chat-messages'

export default function NewCars({
  sorting: initialSorting,
  filters: initialFilters,
}: Props) {
  const [sorting, setSorting] = useSorting(initialSorting)
  const [filters, setFilters] = useFilters(initialFilters)

  let [editingFilters, setEditingFilters] = useState<boolean>(false)
  let [showChatMessages, setShowChatMessages] = useState<boolean>(false)
  let [releaseBodyLock, setReleaseBodyLock] = useState<boolean>(false)

  useEffect(() => {
    if (!showChatMessages) {
      setReleaseBodyLock(false)
    }
  }, [showChatMessages])

  // Load initial messages from localStorage
  const [initialMessages] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Initialize useChat at parent level so it persists
  const chatState = useChat({
    messages: initialMessages,
  })

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (chatState.messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState.messages))
    }
  }, [chatState.messages])

  const handleClearChat = () => {
    chatState.setMessages([])
    localStorage.removeItem(CHAT_STORAGE_KEY)
  }

  useBodyScrollLock((editingFilters || showChatMessages) && !releaseBodyLock)

  const handleRemoveFilter = (name: keyof Filters) => () =>
    setFilters((filters) => {
      let newFilters = Object.assign({}, filters)
      delete newFilters[name]
      return newFilters
    })

  const filteredCars = newCars.filter(carFilter(filters))

  const hasFilter = Object.values(filters).length > 0

  const filteredCarCount = newCars.length - filteredCars.length

  return (
    <div className="content">
      <header>
        <Title />

        <p className="description">
          Listi yfir alla {newCars.length} bílana sem eru seldir á Íslandi og
          eru 100% rafdrifnir. Upplýsingar um drægni eru samkvæmt{' '}
          <a href="http://wltpfacts.eu/">WLTP</a> mælingum frá framleiðenda en
          raundrægni er háð aðstæðum og aksturslagi.
          <em>
            Kaupendur nýskráðra rafbíla sem kosta minna en 10 milljónir eiga
            kost á að{' '}
            <a href="https://island.is/rafbilastyrkir">
              sækja um 900.000 kr. rafbílastyrk
            </a>
            {' '}út árið 2025.
          </em>
        </p>

        <div className="sorting-title">Raða eftir:</div>

        <Toggles<Sorting>
          currentValue={sorting}
          items={[
            ['Nafni', 'name'],
            ['Verði', 'price'],
            ['Drægni', 'range'],
            ['Hröðun', 'acceleration'],
            ['Verði á km', 'value'],
          ]}
          onClick={setSorting}
        />

        <div className="filters-box">
          {hasFilter && (
            <div className="filters-title">
              {filteredCars.length}{' '}
              {filteredCars.length.toString().match(/.*1$/m)
                ? 'bíll passar við:'
                : 'bílar passa við:'}
            </div>
          )}
          <div className="filters">
            {filters.name && (
              <button className="filter" onClick={handleRemoveFilter('name')}>
                Nafn: <span>{filters.name.join(', ')}</span>
              </button>
            )}

            {filters.price && (
              <button className="filter" onClick={handleRemoveFilter('price')}>
                Verð: <span>↓{addDecimalSeprators(filters.price)} kr.</span>
              </button>
            )}

            {filters.range && (
              <button className="filter" onClick={handleRemoveFilter('range')}>
                Drægni: <span>↑{filters.range} km.</span>
              </button>
            )}

            {filters.drive && (
              <button className="filter" onClick={handleRemoveFilter('drive')}>
                Drif: <span>{filters.drive.join(', ')}</span>
              </button>
            )}

            {filters.acceleration && (
              <button
                className="filter"
                onClick={handleRemoveFilter('acceleration')}
              >
                Hröðun <span>↓{filters.acceleration.toFixed(1)}s</span>
              </button>
            )}

            {filters.value && (
              <button className="filter" onClick={handleRemoveFilter('value')}>
                Verði á km:{' '}
                <span>↓{addDecimalSeprators(filters.value)} kr.</span>
              </button>
            )}

            {filters.fastcharge && (
              <button
                className="filter"
                onClick={handleRemoveFilter('fastcharge')}
              >
                Hraðhleðsla: <span>↑{filters.fastcharge} km/min</span>
              </button>
            )}

            {filters.availability && (
              <button
                className="filter"
                onClick={handleRemoveFilter('availability')}
              >
                Framboð:{' '}
                <span>
                  {filters.availability === 'available'
                    ? 'Fáanlegir'
                    : 'Væntanlegir'}
                </span>
              </button>
            )}
            <button
              className="add-filter"
              onClick={() => setEditingFilters(() => true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="none"
              >
                <path
                  fill="#000"
                  d="m14.298 13.202-3.87-3.87A5.514 5.514 0 0 0 11.55 6C11.55 2.94 9.061.45 6 .45 2.94.45.45 2.94.45 6c0 3.061 2.49 5.55 5.55 5.55a5.514 5.514 0 0 0 3.332-1.122l3.87 3.87a.775.775 0 1 0 1.096-1.096ZM1.55 6A4.455 4.455 0 0 1 6 1.55 4.455 4.455 0 0 1 10.45 6 4.455 4.455 0 0 1 6 10.45 4.455 4.455 0 0 1 1.55 6Z"
                />
              </svg>
              Leita
            </button>
          </div>
        </div>
      </header>

      {stableSort(filteredCars, carSorter(sorting)).map((car, index) => (
        <Car
          priority={index <= 1}
          car={car}
          key={`${car.make} ${car.model} ${car.subModel} ${car.price}`}
          showValue={sorting === 'value' || Boolean(filters.value)}
        />
      ))}

      {hasFilter && filteredCarCount > 0 && (
        <div className="filters-reset-box">
          {filteredCarCount}
          {filteredCarCount.toString().match(/.*1$/m)
            ? ' bíll passaði '
            : ' bílar pössuðu '}
          ekki við leitina{' '}
          <button
            className="filters-reset-button"
            onClick={(_event) => {
              setFilters(() => ({}))
              window.scrollTo({ top: 0 })
            }}
          >
            Sýna alla
          </button>
        </div>
      )}

      {editingFilters && (
        <FilterModal
          initialFilters={filters}
          onSubmit={(filters: Filters) => setFilters(() => filters)}
          onDone={() => setEditingFilters(() => false)}
          getCountPreview={(filters: Filters) =>
            newCars.filter(carFilter(filters)).length
          }
        />
      )}

      {showChatMessages && (
        <ChatModal
          onDone={() => setShowChatMessages(() => false)}
          messages={chatState.messages}
          status={chatState.status}
          onClearChat={handleClearChat}
          onReleaseBodyLock={() => setReleaseBodyLock(() => true)}
          onSendMessage={(text) => {
            chatState.sendMessage({
              role: 'user',
              parts: [{ type: 'text', text }],
            })
          }}
        />
      )}

      <FloatingChat
        chatState={chatState}
        onOpenChat={() => setShowChatMessages(true)}
        hide={editingFilters}
      />

      <style jsx>
        {`
          .content {
            max-width: 1024px;
            margin: 0 auto;
          }
          header {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 0 auto;
            max-width: 480px;
            padding: 16px;
          }

          .description {
            line-height: 1.5;
            font-size: 14px;
            padding-top: 1.5em;
            margin: 0 0 2em 0;
            color: ${colors.stone};
            max-width: 33em;
            text-wrap: pretty;
          }
          .description a {
            text-decoration: none;
            font-weight: 600;
            color: black;
          }
          .description a:hover {
            text-decoration: underline;
          }
          .description em {
            display: inline-block;
            font-size: 12px;
            color: #777;
            margin-top: 0.5em;
          }
          .description em a {
            color: #222;
          }

          .sorting-title,
          .filters-title {
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
          }

          .filters-box {
            margin-top: 20px;
          }
          .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-self: flex-start;
            max-width: 100%;
            margin-left: -2px;
          }
          .filter {
            flex-shrink: 0;
            position: relative;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px 5px 10px;
            border: 1px solid ${colors.smoke};
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${colors.lab};
            transition: all 0.2s;
            color: ${colors.clay};
          }
          .filter span {
            color: ${colors.tint};
            transition: color 0.2s;
            margin-left: 3px;
          }
          .filter:hover span {
            color: ${colors.stone};
          }
          .filter::after {
            content: '+';
            transform: rotate(45deg);
            margin-left: 6px;
            font-size: 16px;
            line-height: 10px;
            margin-top: -1px;
            color: ${colors.clay};
            transition: color 0.2s;
          }
          .filter:last-child {
            border-right-width: 0;
          }
          .filter:active {
            color: #000;
          }
          .filter:hover {
            background-color: #f8f8f8;
          }
          .filter:hover::after {
            color: #222;
          }

          .add-filter {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            gap: 6px;
            padding: 8px 16px 8px 12px;
            border: 0;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.06);
            transition: all 0.2s;
            color: ${colors.tint};
          }
          .add-filter:hover {
            background-color: rgba(0, 0, 0, 0.09);
          }
          .add-filter:active {
            transform: translateY(0);
          }
          .add-filter svg {
            opacity: 0.7;
          }

          .filters-reset-box {
            padding: 16px;
            display: flex;
            align-items: center;
            margin: 0 auto;
            max-width: 480px;
            grid-gap: 8px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 40px;
          }

          .filters-reset-button {
            border: 0;
            flex-shrink: 0;
            margin: 0 8px 0 0;
            font-size: 12px;
            font-weight: 600;
            padding: 5px 12px 5px 12px;
            border-radius: 100px;
            cursor: pointer;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #eee;
            transition: all 0.2s;
            color: ${colors.tint};
          }
          .filters-reset-button:hover {
            background-color: #f8f8f8;
          }

          @media screen and (min-width: 375px) {
            header {
              padding: 24px;
            }
            .filters-reset-box {
              padding: 24px;
            }
          }

          @media screen and (min-width: 768px) {
            header {
              padding-left: 40px;
              max-width: none;
              padding-bottom: 40px;
            }
            .description {
              font-size: 16px;
            }
            .filters-reset-box {
              padding-left: 40px;
              max-width: none;
            }
          }
        `}
      </style>
    </div>
  )
}

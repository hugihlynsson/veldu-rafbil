// The cars each car's page offers as similar, and its review is written
// against, by slug. Written by scripts/similar-cars.ts, closest in price and
// range first; an entry can be set by hand, and a run that adds new cars
// keeps it. similarCars.test.ts fails while a car has none.

const similarCars: Readonly<Record<string, ReadonlyArray<string>>> = {
  'audi-a6-e-tron-sportback-quattro': [
    'mercedes-benz-cla-350-4matic',
    'volvo-ex60-p10',
    'audi-q6-e-tron-base',
  ],
  'audi-a6-e-tron-avant-quattro': [
    'volvo-ex60-p10',
    'audi-q6-e-tron-base',
    'mercedes-benz-cla-shooting-brake-350-4matic',
  ],
  'audi-e-tron-gt-quattro': [
    'lexus-rz-550e-f-sport',
    'audi-sq6-e-tron-base',
    'porsche-cayenne-base',
  ],
  'audi-q4-e-tron-45-quattro': [
    'toyota-bz4x-touring-awd',
    'smart-5-brabus',
    'nissan-ariya-e-4orce',
  ],
  'audi-q6-e-tron-base': [
    'volvo-ex60-p10',
    'audi-a6-e-tron-avant-quattro',
    'mercedes-benz-cla-shooting-brake-350-4matic',
  ],
  'audi-q6-e-tron-sportback': [
    'mercedes-benz-glc-300-4matic',
    'volvo-ex60-p10',
    'audi-a6-e-tron-avant-quattro',
  ],
  'audi-sq6-e-tron-base': [
    'porsche-cayenne-base',
    'porsche-taycan-4-plus',
    'bmw-ix-xdrive-60-sport',
  ],
  'bmw-i4-40-xdrive': [
    'mercedes-benz-glc-300-4matic',
    'lexus-rz-350e',
    'audi-q6-e-tron-sportback',
  ],
  'bmw-i4-m60-xdrive': [
    'polestar-3-performance',
    'porsche-macan-4-electric',
    'lexus-es-350e',
  ],
  'bmw-i5-edrive40': [
    'lexus-es-350e',
    'lexus-rz-350e',
    'polestar-3-performance',
  ],
  'bmw-i5-m60-xdrive': [
    'porsche-taycan-4s-plus',
    'porsche-cayenne-s',
    'audi-sq6-e-tron-base',
  ],
  'bmw-ix-xdrive-45-sport': [
    'porsche-macan-4s-electric',
    'mercedes-benz-eqe-suv-350-4matic',
    'porsche-taycan-plus',
  ],
  'bmw-ix-xdrive-60-sport': [
    'porsche-cayenne-coupe',
    'porsche-taycan-4-plus',
    'audi-sq6-e-tron-base',
  ],
  'bmw-ix1-edrive-20': [
    'byd-seal-u-base',
    'opel-grandland-base',
    'subaru-uncharted-base',
  ],
  'bmw-ix1-xdrive-30': [
    'kia-ev5-awd',
    'mercedes-benz-eqa-suv-300-4matic',
    'mini-countryman-e',
  ],
  'bmw-ix3-40': [
    'volkswagen-id-7-gtx',
    'polestar-4-suv-long-range-dual-motor',
    'skoda-enyaq-rs',
  ],
  'bmw-ix3-50-xdrive': [
    'volvo-ex60-p12',
    'mercedes-benz-c-400-4matic',
    'mercedes-benz-glc-400-4matic',
  ],
  'byd-dolphin-base': [
    'leapmotor-c10-pro',
    'skoda-epiq-55',
    'nissan-leaf-standard-range',
  ],
  'byd-seal-base': [
    'kia-ev5-base',
    'kia-ev6-2025-long-range-awd',
    'skoda-enyaq-85x',
  ],
  'byd-seal-u-base': [
    'subaru-uncharted-base',
    'bmw-ix1-edrive-20',
    'mg-mgs6-dual-motor',
  ],
  'byd-sealion-7-base': [
    'nissan-ariya-e-4orce',
    'toyota-c-hr-awd',
    'subaru-e-outback-base',
  ],
  'byd-tang-flagship': [
    'volkswagen-id-buzz-gtx',
    'hyundai-ioniq-9-long-range-awd',
    'xpeng-x9-awd-performance',
  ],
  'citroen-e-c4-base': [
    'fiat-600e-base',
    'volkswagen-id-cross-base',
    'renault-scenic-e-tech-ev60',
  ],
  'fiat-500e-base': [
    'mini-aceman-e',
    'hyundai-ioniq-3-standard-range',
    'smart-1-pro',
  ],
  'fiat-600e-base': [
    'citroen-e-c4-base',
    'volkswagen-id-cross-base',
    'jeep-avenger-base',
  ],
  'ford-capri-base': [
    'polestar-2-long-range-dual-motor',
    'tesla-model-y-premium-long-range',
    'ford-explorer-er-awd',
  ],
  'ford-explorer-er-awd': [
    'hyundai-ioniq-5-long-range-awd',
    'ford-capri-base',
    'polestar-2-long-range-dual-motor',
  ],
  'ford-mustang-mach-e-lr-awd': [
    'skoda-elroq-rs',
    'smart-5-pulse',
    'skoda-enyaq-85x',
  ],
  'ford-puma-base': [
    'hyundai-inster-long-range',
    'leapmotor-b10-67-1-kwh',
    'renault-r5-e-tech-52-kwh',
  ],
  'hongqi-ehs5-base': [
    'peugeot-e-3008-base',
    'mazda-cx-6e-78-kwh',
    'volvo-ex30-single-motor-extended-range',
  ],
  'hongqi-ehs7-premium': [
    'mercedes-benz-cla-200',
    'polestar-2-long-range-performance',
    'subaru-e-outback-base',
  ],
  'hyundai-inster-base': [
    'kia-ev2-standard-range',
    'leapmotor-b10-base',
    'leapmotor-b03x-promax',
  ],
  'hyundai-inster-long-range': [
    'ford-puma-base',
    'gwm-ora-3-48-kwh',
    'renault-r5-e-tech-base',
  ],
  'hyundai-ioniq-3-standard-range': [
    'peugeot-e-2008-54-kwh',
    'renault-r5-e-tech-52-kwh',
    'fiat-500e-base',
  ],
  'hyundai-ioniq-3-long-range': [
    'leapmotor-c10-promax',
    'mg-mgs5-lux',
    'hyundai-kona-electric-65-kwh',
  ],
  'hyundai-ioniq-5-long-range-awd': [
    'ford-explorer-er-awd',
    'nissan-ariya-base',
    'kia-ev6-2025-long-range-awd',
  ],
  'hyundai-ioniq-9-long-range-awd': [
    'xpeng-x9-awd-performance',
    'byd-tang-flagship',
    'volkswagen-id-buzz-gtx',
  ],
  'hyundai-ioniq-9-long-range-performance-awd': [
    'xpeng-x9-awd-performance',
    'kia-ev9-base',
    'volvo-ex90-twin-motor',
  ],
  'hyundai-kona-electric-65-kwh': [
    'leapmotor-c10-promax',
    'volkswagen-id-3-neo-58-kwh',
    'tesla-model-y-standard-range',
  ],
  'hyundai-staria-electric-base': [
    'peugeot-e-traveller-base',
    'toyota-proace-verso-base',
    'kia-pv5-base',
  ],
  'jeep-avenger-base': [
    'suzuki-e-vitara-4x4-allgrip',
    'smart-1-pulse',
    'xpeng-g6-rwd-standard-range',
  ],
  'kgm-musso-ev-base': [
    'toyota-urban-cruiser-active-fwd',
    'smart-1-pulse',
    'smart-3-pulse',
  ],
  'kgm-musso-ev-4wd': [
    'volvo-ex30-cross-country-twin-motor-performance',
    'mini-countryman-e',
    'mercedes-benz-eqa-suv-300-4matic',
  ],
  'kgm-torres-evx': [
    'volkswagen-id-3-neo-58-kwh',
    'leapmotor-c10-promax-awd',
    'renault-scenic-e-tech-ev60',
  ],
  'kia-ev2-standard-range': [
    'leapmotor-b10-base',
    'hyundai-inster-base',
    'gwm-ora-3-48-kwh',
  ],
  'kia-ev2-long-range': [
    'volkswagen-id-polo-base',
    'nissan-leaf-standard-range',
    'skoda-epiq-55',
  ],
  'kia-ev3-standard-range': [
    'volkswagen-id-3-pro',
    'peugeot-e-2008-54-kwh',
    'byd-dolphin-base',
  ],
  'kia-ev3-long-range': [
    'nissan-leaf-extended-range',
    'mazda-6e-long-range',
    'hyundai-kona-electric-65-kwh',
  ],
  'kia-ev3-long-range-awd': [
    'xpeng-g6-rwd-long-range',
    'skoda-elroq-85x',
    'renault-scenic-e-tech-ev87',
  ],
  'kia-ev4-base': [
    'renault-scenic-e-tech-ev87',
    'skoda-elroq-85',
    'tesla-model-3-long-range-fjorhjoladrif',
  ],
  'kia-ev4-fastback': [
    'skoda-elroq-85',
    'nissan-leaf-extended-range',
    'kia-ev3-long-range',
  ],
  'kia-ev5-base': ['byd-seal-base', 'skoda-enyaq-85x', 'smart-5-pulse'],
  'kia-ev5-awd': [
    'bmw-ix1-xdrive-30',
    'volkswagen-id-4-gtx',
    'mercedes-benz-eqa-suv-300-4matic',
  ],
  'kia-ev6-2025-long-range-awd': [
    'nissan-ariya-base',
    'subaru-solterra-base',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'kia-ev9-base': [
    'xpeng-x9-awd-performance',
    'byd-tang-flagship',
    'volkswagen-id-buzz-gtx',
  ],
  'kia-ev9-gt': [
    'volvo-ex90-twin-motor',
    'mercedes-benz-eqv-300',
    'hyundai-ioniq-9-long-range-performance-awd',
  ],
  'kia-pv5-base': [
    'peugeot-e-5008-dual-motor',
    'toyota-proace-city-verso-base',
    'skoda-peaq-90x',
  ],
  'leapmotor-t03-base': [
    'leapmotor-b03x-pro',
    'mg-mg4-urban-standard-range',
    'hyundai-inster-base',
  ],
  'leapmotor-b03x-pro': [
    'mg-mg4-urban-standard-range',
    'leapmotor-t03-base',
    'hyundai-inster-base',
  ],
  'leapmotor-b03x-promax': [
    'leapmotor-b05-pro',
    'mg-mg4-urban-long-range',
    'hyundai-inster-base',
  ],
  'leapmotor-b05-pro': [
    'leapmotor-b03x-promax',
    'mg-mg4-urban-long-range',
    'hyundai-inster-base',
  ],
  'leapmotor-b05-promax': [
    'mg-mg4-urban-long-range',
    'leapmotor-b10-base',
    'kia-ev2-standard-range',
  ],
  'leapmotor-b10-base': [
    'kia-ev2-standard-range',
    'mg-mg4-urban-long-range',
    'hyundai-inster-base',
  ],
  'leapmotor-b10-67-1-kwh': [
    'kia-ev2-long-range',
    'skoda-epiq-55',
    'byd-dolphin-base',
  ],
  'leapmotor-c10-pro': [
    'byd-dolphin-base',
    'renault-r5-e-tech-52-kwh',
    'skoda-epiq-55',
  ],
  'leapmotor-c10-promax': [
    'hyundai-kona-electric-65-kwh',
    'hyundai-ioniq-3-long-range',
    'volkswagen-id-3-neo-58-kwh',
  ],
  'leapmotor-c10-promax-awd': [
    'renault-scenic-e-tech-ev60',
    'xpeng-g6-rwd-standard-range',
    'toyota-urban-cruiser-active-fwd',
  ],
  'lexus-es-350e': [
    'bmw-i5-edrive40',
    'polestar-3-performance',
    'lexus-rz-350e',
  ],
  'lexus-es-500e': [
    'mercedes-benz-eqe-suv-350-4matic',
    'bmw-i4-m60-xdrive',
    'polestar-3-performance',
  ],
  'lexus-rz-350e': [
    'bmw-i5-edrive40',
    'lexus-es-350e',
    'polestar-3-performance',
  ],
  'lexus-rz-500e': [
    'lexus-es-500e',
    'mercedes-benz-eqe-suv-350-4matic',
    'bmw-i4-m60-xdrive',
  ],
  'lexus-rz-550e-f-sport': [
    'audi-e-tron-gt-quattro',
    'audi-sq6-e-tron-base',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'lexus-ux-300e': [
    'xpeng-g9-awd-performance',
    'audi-q6-e-tron-base',
    'volvo-ex60-p10',
  ],
  'mazda-6e-long-range': [
    'volkswagen-id-3-neo-58-kwh',
    'nissan-leaf-extended-range',
    'hyundai-kona-electric-65-kwh',
  ],
  'mazda-cx-6e-78-kwh': [
    'volvo-ex30-single-motor-extended-range',
    'smart-5-pro',
    'hongqi-ehs5-base',
  ],
  'mercedes-benz-c-400-4matic': [
    'bmw-ix3-50-xdrive',
    'volvo-ex60-p12',
    'mercedes-benz-glc-400-4matic',
  ],
  'mercedes-benz-cla-200': [
    'hongqi-ehs7-premium',
    'polestar-2-long-range-performance',
    'subaru-e-outback-base',
  ],
  'mercedes-benz-cla-350-4matic': [
    'audi-a6-e-tron-sportback-quattro',
    'volvo-ex60-p10',
    'mercedes-benz-c-400-4matic',
  ],
  'mercedes-benz-cla-shooting-brake-350-4matic': [
    'audi-a6-e-tron-avant-quattro',
    'volvo-ex60-p10',
    'audi-q6-e-tron-base',
  ],
  'mercedes-benz-cla-amg-45-4matic': [
    'volvo-es90-twin-motor-performance',
    'porsche-macan-4-electric',
    'polestar-3-performance',
  ],
  'mercedes-benz-eqa-suv-300-4matic': [
    'mini-countryman-e',
    'bmw-ix1-xdrive-30',
    'volvo-ex30-cross-country-twin-motor-performance',
  ],
  'mercedes-benz-glb-350-4matic-eq': [
    'skoda-peaq-90x',
    'hyundai-ioniq-9-long-range-awd',
    'byd-tang-flagship',
  ],
  'mercedes-benz-glc-300-4matic': [
    'audi-q6-e-tron-sportback',
    'bmw-i4-40-xdrive',
    'polestar-3-base',
  ],
  'mercedes-benz-glc-400-4matic': [
    'mercedes-benz-c-400-4matic',
    'volvo-es90-twin-motor',
    'bmw-ix3-50-xdrive',
  ],
  'mercedes-benz-eqe-suv-350-4matic': [
    'bmw-ix-xdrive-45-sport',
    'lexus-es-500e',
    'bmw-i4-m60-xdrive',
  ],
  'mercedes-benz-eqs-580-4matic': [
    'porsche-cayenne-turbo',
    'range-rover-electric-ev450',
    'mercedes-benz-g-class-580-eq',
  ],
  'mercedes-benz-eqs-suv-580-4matic': [
    'mercedes-benz-vle-400-4matic',
    'volvo-ex90-twin-motor-performance',
    'range-rover-electric-ev450',
  ],
  'mercedes-benz-eqt-200': [
    'toyota-proace-city-verso-base',
    'peugeot-e-rifter-base',
    'kia-pv5-base',
  ],
  'mercedes-benz-eqv-300': [
    'mercedes-benz-evito-tourer',
    'kia-ev9-gt',
    'volvo-ex90-twin-motor',
  ],
  'mercedes-benz-vle-300': [
    'volvo-ex90-twin-motor',
    'kia-ev9-gt',
    'hyundai-ioniq-9-long-range-performance-awd',
  ],
  'mercedes-benz-vle-400-4matic': [
    'volvo-ex90-twin-motor-performance',
    'kia-ev9-gt',
    'hyundai-ioniq-9-long-range-performance-awd',
  ],
  'mercedes-benz-g-class-580-eq': [
    'range-rover-electric-ev450',
    'porsche-cayenne-turbo',
    'mercedes-benz-eqs-580-4matic',
  ],
  'mercedes-benz-evito-tourer': [
    'mercedes-benz-eqv-300',
    'toyota-proace-verso-base',
    'peugeot-e-traveller-base',
  ],
  'mg-cyberster-gt': [
    'toyota-bz4x-touring-awd',
    'audi-q4-e-tron-45-quattro',
    'skoda-enyaq-rs',
  ],
  'mg-mg4-urban-standard-range': [
    'leapmotor-b03x-pro',
    'hyundai-inster-base',
    'leapmotor-b05-pro',
  ],
  'mg-mg4-urban-long-range': [
    'leapmotor-b10-base',
    'leapmotor-b05-promax',
    'leapmotor-b03x-promax',
  ],
  'mg-mgs5-lux': [
    'hyundai-ioniq-3-long-range',
    'kgm-torres-evx',
    'volkswagen-id-cross-base',
  ],
  'mg-mgs6-dual-motor': [
    'subaru-uncharted-base',
    'byd-seal-u-base',
    'volvo-ex30-twin-motor-performance',
  ],
  'mini-aceman-e': [
    'fiat-500e-base',
    'volvo-ex30-single-motor',
    'fiat-600e-base',
  ],
  'mini-countryman-e': [
    'mercedes-benz-eqa-suv-300-4matic',
    'volvo-ex30-cross-country-twin-motor-performance',
    'bmw-ix1-xdrive-30',
  ],
  'mini-countryman-se-4x4': [
    'byd-sealion-7-base',
    'nissan-ariya-e-4orce',
    'bmw-ix1-xdrive-30',
  ],
  'nissan-ariya-base': [
    'kia-ev6-2025-long-range-awd',
    'subaru-solterra-base',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'nissan-ariya-e-4orce': [
    'byd-sealion-7-base',
    'toyota-c-hr-awd',
    'subaru-e-outback-base',
  ],
  'nissan-leaf-standard-range': [
    'skoda-epiq-55',
    'volkswagen-id-polo-base',
    'byd-dolphin-base',
  ],
  'nissan-leaf-extended-range': [
    'kia-ev3-long-range',
    'mazda-6e-long-range',
    'kia-ev4-fastback',
  ],
  'opel-frontera-base': [
    'peugeot-e-rifter-base',
    'kia-ev2-standard-range',
    'gwm-ora-3-48-kwh',
  ],
  'opel-grandland-base': [
    'peugeot-e-3008-dual-motor',
    'bmw-ix1-edrive-20',
    'byd-seal-u-base',
  ],
  'opel-grandland-awd': [
    'subaru-solterra-base',
    'kia-ev6-2025-long-range-awd',
    'nissan-ariya-base',
  ],
  'gwm-ora-3-48-kwh': [
    'renault-r5-e-tech-base',
    'hyundai-inster-long-range',
    'kia-ev2-standard-range',
  ],
  'peugeot-e-2008-54-kwh': [
    'renault-r5-e-tech-52-kwh',
    'kia-ev3-standard-range',
    'leapmotor-c10-pro',
  ],
  'peugeot-e-3008-base': [
    'hongqi-ehs5-base',
    'skoda-elroq-85x',
    'volvo-ex30-single-motor-extended-range',
  ],
  'peugeot-e-3008-dual-motor': [
    'opel-grandland-base',
    'xpeng-g6-awd-performance',
    'volkswagen-id-4-pro-4motion',
  ],
  'peugeot-e-5008-base': [
    'kia-pv5-base',
    'toyota-proace-city-verso-base',
    'skoda-peaq-90x',
  ],
  'peugeot-e-5008-dual-motor': [
    'kia-pv5-base',
    'toyota-proace-city-verso-base',
    'skoda-peaq-90x',
  ],
  'peugeot-e-rifter-base': [
    'toyota-proace-city-verso-base',
    'mercedes-benz-eqt-200',
    'peugeot-e-5008-base',
  ],
  'peugeot-e-traveller-base': [
    'toyota-proace-verso-base',
    'hyundai-staria-electric-base',
    'mercedes-benz-evito-tourer',
  ],
  'polestar-2-long-range-dual-motor': [
    'ford-capri-base',
    'tesla-model-y-premium-long-range',
    'toyota-c-hr-77-kwh',
  ],
  'polestar-2-long-range-performance': [
    'mercedes-benz-cla-200',
    'toyota-bz4x-base',
    'hongqi-ehs7-premium',
  ],
  'polestar-3-base': [
    'volvo-es90-twin-motor',
    'lexus-rz-350e',
    'bmw-i5-edrive40',
  ],
  'polestar-3-performance': [
    'bmw-i4-m60-xdrive',
    'porsche-macan-4-electric',
    'lexus-es-350e',
  ],
  'polestar-4-long-range-dual-motor': [
    'tesla-model-y-performance',
    'smart-5-brabus',
    'volkswagen-id-7-gtx',
  ],
  'polestar-4-suv-long-range-dual-motor': [
    'volkswagen-id-7-gtx',
    'skoda-enyaq-rs',
    'bmw-ix3-40',
  ],
  'porsche-macan-4-electric': [
    'polestar-3-performance',
    'lexus-es-350e',
    'bmw-i4-m60-xdrive',
  ],
  'porsche-macan-4s-electric': [
    'bmw-ix-xdrive-45-sport',
    'porsche-taycan-plus',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'porsche-taycan-plus': [
    'porsche-macan-4s-electric',
    'bmw-ix-xdrive-45-sport',
    'mercedes-benz-cla-amg-45-4matic',
  ],
  'porsche-taycan-4-plus': [
    'porsche-cayenne-base',
    'audi-sq6-e-tron-base',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-taycan-4s-plus': [
    'bmw-i5-m60-xdrive',
    'porsche-cayenne-s',
    'audi-sq6-e-tron-base',
  ],
  'porsche-taycan-4-cross-turismo': [
    'porsche-cayenne-coupe',
    'audi-sq6-e-tron-base',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-taycan-4s-cross-turismo': [
    'porsche-cayenne-s',
    'bmw-i5-m60-xdrive',
    'audi-sq6-e-tron-base',
  ],
  'porsche-cayenne-base': [
    'porsche-taycan-4-plus',
    'audi-sq6-e-tron-base',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-cayenne-coupe': [
    'porsche-taycan-4-plus',
    'bmw-ix-xdrive-60-sport',
    'audi-sq6-e-tron-base',
  ],
  'porsche-cayenne-s': [
    'porsche-taycan-4s-cross-turismo',
    'bmw-i5-m60-xdrive',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-cayenne-s-coupe': [
    'porsche-taycan-4s-cross-turismo',
    'bmw-i5-m60-xdrive',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-cayenne-turbo': [
    'range-rover-electric-ev450',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-580-4matic',
  ],
  'porsche-cayenne-turbo-coupe': [
    'range-rover-electric-ev550',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-580-4matic',
  ],
  'range-rover-electric-ev450': [
    'porsche-cayenne-turbo',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-580-4matic',
  ],
  'range-rover-electric-ev550': [
    'porsche-cayenne-turbo-coupe',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-580-4matic',
  ],
  'renault-r5-e-tech-base': [
    'gwm-ora-3-48-kwh',
    'hyundai-inster-long-range',
    'kia-ev2-standard-range',
  ],
  'renault-r5-e-tech-52-kwh': [
    'leapmotor-c10-pro',
    'byd-dolphin-base',
    'peugeot-e-2008-54-kwh',
  ],
  'renault-scenic-e-tech-ev60': [
    'leapmotor-c10-promax-awd',
    'xpeng-g6-rwd-standard-range',
    'toyota-urban-cruiser-active-fwd',
  ],
  'renault-scenic-e-tech-ev87': [
    'kia-ev3-long-range-awd',
    'tesla-model-3-long-range-fjorhjoladrif',
    'xpeng-g6-rwd-long-range',
  ],
  'skoda-epiq-55': [
    'nissan-leaf-standard-range',
    'volkswagen-id-polo-base',
    'byd-dolphin-base',
  ],
  'skoda-elroq-85': [
    'kia-ev4-fastback',
    'hongqi-ehs5-base',
    'xpeng-g6-rwd-long-range',
  ],
  'skoda-elroq-85x': [
    'xpeng-g6-rwd-long-range',
    'kia-ev3-long-range-awd',
    'peugeot-e-3008-base',
  ],
  'skoda-elroq-rs': [
    'ford-mustang-mach-e-lr-awd',
    'volkswagen-id-4-gtx',
    'smart-5-pulse',
  ],
  'skoda-enyaq-85x': [
    'smart-5-pulse',
    'kia-ev5-base',
    'ford-mustang-mach-e-lr-awd',
  ],
  'skoda-enyaq-rs': [
    'smart-5-brabus',
    'toyota-bz4x-touring-awd',
    'polestar-4-suv-long-range-dual-motor',
  ],
  'skoda-peaq-90x': [
    'mercedes-benz-glb-350-4matic-eq',
    'peugeot-e-5008-dual-motor',
    'kia-pv5-base',
  ],
  'smart-1-pro': [
    'volkswagen-id-3-pro',
    'kia-ev3-standard-range',
    'mg-mgs5-lux',
  ],
  'smart-1-pulse': [
    'suzuki-e-vitara-4x4-allgrip',
    'jeep-avenger-base',
    'kgm-musso-ev-base',
  ],
  'smart-1-brabus': [
    'toyota-urban-cruiser-active-awd',
    'smart-3-brabus',
    'volvo-ex30-twin-motor-performance',
  ],
  'smart-3-pulse': [
    'toyota-urban-cruiser-active-awd',
    'kgm-musso-ev-base',
    'toyota-c-hr-base',
  ],
  'smart-3-brabus': [
    'smart-1-brabus',
    'toyota-urban-cruiser-active-awd',
    'volvo-ex30-twin-motor-performance',
  ],
  'smart-5-pro': [
    'toyota-urban-cruiser-active-fwd',
    'xpeng-g6-rwd-standard-range',
    'mazda-cx-6e-78-kwh',
  ],
  'smart-5-pulse': [
    'skoda-enyaq-85x',
    'ford-mustang-mach-e-lr-awd',
    'kia-ev5-base',
  ],
  'smart-5-brabus': [
    'skoda-enyaq-rs',
    'polestar-4-long-range-dual-motor',
    'toyota-bz4x-touring-awd',
  ],
  'subaru-e-outback-base': [
    'toyota-bz4x-awd',
    'hongqi-ehs7-premium',
    'mercedes-benz-cla-200',
  ],
  'subaru-solterra-base': [
    'kia-ev6-2025-long-range-awd',
    'nissan-ariya-base',
    'opel-grandland-awd',
  ],
  'subaru-uncharted-base': [
    'byd-seal-u-base',
    'mg-mgs6-dual-motor',
    'bmw-ix1-edrive-20',
  ],
  'suzuki-e-vitara-4x4-allgrip': [
    'jeep-avenger-base',
    'smart-1-pulse',
    'toyota-urban-cruiser-active-fwd',
  ],
  'tesla-model-3-afturhjoladrif': [
    'hyundai-ioniq-3-long-range',
    'leapmotor-c10-promax',
    'hyundai-kona-electric-65-kwh',
  ],
  'tesla-model-3-long-range-afturhjoladrif': [
    'kia-ev4-fastback',
    'nissan-leaf-extended-range',
    'skoda-elroq-85',
  ],
  'tesla-model-3-long-range-fjorhjoladrif': [
    'renault-scenic-e-tech-ev87',
    'kia-ev4-base',
    'xpeng-g6-rwd-long-range',
  ],
  'tesla-model-3-performance': [
    'ford-explorer-er-awd',
    'kia-ev5-base',
    'ford-capri-base',
  ],
  'tesla-model-y-standard-range': [
    'volkswagen-id-3-neo-58-kwh',
    'hyundai-kona-electric-65-kwh',
    'leapmotor-c10-promax',
  ],
  'tesla-model-y-premium-long-range': [
    'toyota-c-hr-77-kwh',
    'polestar-2-long-range-dual-motor',
    'ford-capri-base',
  ],
  'tesla-model-y-long-range-dual-motor': [
    'ford-mustang-mach-e-lr-awd',
    'skoda-elroq-rs',
    'toyota-c-hr-77-kwh',
  ],
  'tesla-model-y-performance': [
    'polestar-4-long-range-dual-motor',
    'toyota-bz4x-touring-base',
    'volvo-ec40-recharge-twin',
  ],
  'toyota-bz4x-base': [
    'polestar-2-long-range-performance',
    'skoda-elroq-rs',
    'mercedes-benz-cla-200',
  ],
  'toyota-bz4x-awd': [
    'toyota-c-hr-awd',
    'subaru-e-outback-base',
    'volvo-ex40-recharge-twin',
  ],
  'toyota-bz4x-touring-base': [
    'volvo-ec40-recharge-twin',
    'volvo-ex40-recharge-twin',
    'polestar-2-long-range-performance',
  ],
  'toyota-bz4x-touring-awd': [
    'audi-q4-e-tron-45-quattro',
    'smart-5-brabus',
    'skoda-enyaq-rs',
  ],
  'toyota-c-hr-base': [
    'volvo-ex30-twin-motor-performance',
    'mg-mgs6-dual-motor',
    'smart-3-pulse',
  ],
  'toyota-c-hr-77-kwh': [
    'tesla-model-y-premium-long-range',
    'polestar-2-long-range-dual-motor',
    'ford-capri-base',
  ],
  'toyota-c-hr-awd': [
    'toyota-bz4x-awd',
    'nissan-ariya-e-4orce',
    'byd-sealion-7-base',
  ],
  'toyota-proace-city-verso-base': [
    'mercedes-benz-eqt-200',
    'kia-pv5-base',
    'peugeot-e-rifter-base',
  ],
  'toyota-proace-verso-base': [
    'peugeot-e-traveller-base',
    'mercedes-benz-evito-tourer',
    'hyundai-staria-electric-base',
  ],
  'toyota-urban-cruiser-active-fwd': [
    'xpeng-g6-rwd-standard-range',
    'renault-scenic-e-tech-ev60',
    'kgm-musso-ev-base',
  ],
  'toyota-urban-cruiser-active-awd': [
    'smart-1-brabus',
    'smart-3-pulse',
    'toyota-c-hr-base',
  ],
  'volkswagen-id-buzz-gtx': [
    'byd-tang-flagship',
    'kia-ev9-base',
    'hyundai-ioniq-9-long-range-awd',
  ],
  'volkswagen-id-polo-base': [
    'nissan-leaf-standard-range',
    'skoda-epiq-55',
    'kia-ev2-long-range',
  ],
  'volkswagen-id-cross-base': [
    'citroen-e-c4-base',
    'fiat-600e-base',
    'renault-scenic-e-tech-ev60',
  ],
  'volkswagen-id-3-pro': [
    'kia-ev3-standard-range',
    'smart-1-pro',
    'peugeot-e-2008-54-kwh',
  ],
  'volkswagen-id-3-neo-58-kwh': [
    'kgm-torres-evx',
    'tesla-model-y-standard-range',
    'hyundai-kona-electric-65-kwh',
  ],
  'volkswagen-id-4-gtx': [
    'skoda-elroq-rs',
    'ford-mustang-mach-e-lr-awd',
    'skoda-enyaq-85x',
  ],
  'volkswagen-id-4-pro-4motion': [
    'peugeot-e-3008-dual-motor',
    'xpeng-g6-awd-performance',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'volkswagen-id-7-gtx': [
    'polestar-4-suv-long-range-dual-motor',
    'bmw-ix3-40',
    'skoda-enyaq-rs',
  ],
  'volvo-ec40-recharge-twin': [
    'toyota-bz4x-touring-base',
    'volvo-ex40-recharge-twin',
    'mercedes-benz-cla-200',
  ],
  'volvo-es90-twin-motor': [
    'polestar-3-base',
    'mercedes-benz-glc-400-4matic',
    'mercedes-benz-cla-amg-45-4matic',
  ],
  'volvo-es90-twin-motor-performance': [
    'mercedes-benz-cla-amg-45-4matic',
    'porsche-macan-4-electric',
    'lexus-es-350e',
  ],
  'volvo-ex40-recharge-twin': [
    'volvo-ec40-recharge-twin',
    'toyota-bz4x-touring-base',
    'subaru-e-outback-base',
  ],
  'volvo-ex30-single-motor': [
    'suzuki-e-vitara-4x4-allgrip',
    'smart-1-pulse',
    'jeep-avenger-base',
  ],
  'volvo-ex30-single-motor-extended-range': [
    'mazda-cx-6e-78-kwh',
    'mg-mgs6-dual-motor',
    'toyota-c-hr-base',
  ],
  'volvo-ex30-twin-motor-performance': [
    'toyota-c-hr-base',
    'mg-mgs6-dual-motor',
    'subaru-uncharted-base',
  ],
  'volvo-ex30-cross-country-twin-motor-performance': [
    'mini-countryman-e',
    'mercedes-benz-eqa-suv-300-4matic',
    'kgm-musso-ev-4wd',
  ],
  'volvo-ex60-p10': [
    'audi-a6-e-tron-avant-quattro',
    'audi-q6-e-tron-base',
    'mercedes-benz-cla-shooting-brake-350-4matic',
  ],
  'volvo-ex60-p12': [
    'bmw-ix3-50-xdrive',
    'mercedes-benz-c-400-4matic',
    'mercedes-benz-glc-400-4matic',
  ],
  'volvo-ex90-twin-motor': [
    'mercedes-benz-vle-400-4matic',
    'kia-ev9-gt',
    'hyundai-ioniq-9-long-range-performance-awd',
  ],
  'volvo-ex90-twin-motor-performance': [
    'mercedes-benz-vle-400-4matic',
    'kia-ev9-gt',
    'hyundai-ioniq-9-long-range-performance-awd',
  ],
  'xpeng-g6-rwd-standard-range': [
    'leapmotor-c10-promax-awd',
    'renault-scenic-e-tech-ev60',
    'toyota-urban-cruiser-active-fwd',
  ],
  'xpeng-g6-rwd-long-range': [
    'skoda-elroq-85x',
    'kia-ev3-long-range-awd',
    'peugeot-e-3008-base',
  ],
  'xpeng-g6-awd-performance': [
    'peugeot-e-3008-dual-motor',
    'volkswagen-id-4-pro-4motion',
    'opel-grandland-base',
  ],
  'xpeng-g9-awd-performance': [
    'audi-q6-e-tron-base',
    'lexus-ux-300e',
    'volvo-ex60-p10',
  ],
  'xpeng-x9-awd-performance': [
    'hyundai-ioniq-9-long-range-awd',
    'kia-ev9-base',
    'byd-tang-flagship',
  ],
}

export default similarCars

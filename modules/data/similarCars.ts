// The cars each car's page offers as similar, and its review is written
// against, by slug. Picked by hand, from cars of the same kind and seats near
// it in price and range, so that every car is offered somewhere and none on
// too many pages. scripts/similar-cars.ts fills in a new car's entry from
// price and range alone: look it over, and offer the new car on a page or two.

const similarCars: Readonly<Record<string, ReadonlyArray<string>>> = {
  'audi-a6-e-tron-sportback-quattro': [
    'mercedes-benz-cla-350-4matic',
    'bmw-i4-40-xdrive',
    'polestar-4-long-range-dual-motor',
  ],
  'audi-a6-e-tron-avant-quattro': [
    'mercedes-benz-cla-shooting-brake-350-4matic',
    'volkswagen-id-7-gtx',
    'volvo-ex60-p10',
  ],
  'audi-e-tron-gt-quattro': [
    'porsche-taycan-4-plus',
    'bmw-i5-m60-xdrive',
    'mercedes-benz-cla-amg-45-4matic',
  ],
  'audi-q4-e-tron-45-quattro': [
    'volvo-ex40-recharge-twin',
    'skoda-enyaq-rs',
    'bmw-ix1-xdrive-30',
  ],
  'audi-q6-e-tron-base': [
    'volvo-ex60-p10',
    'mercedes-benz-glc-300-4matic',
    'xpeng-g9-awd-performance',
  ],
  'audi-q6-e-tron-sportback': [
    'polestar-4-suv-long-range-dual-motor',
    'mercedes-benz-glc-300-4matic',
    'bmw-ix3-50-xdrive',
  ],
  'audi-sq6-e-tron-base': [
    'porsche-macan-4s-electric',
    'bmw-ix-xdrive-60-sport',
    'porsche-cayenne-base',
  ],
  'bmw-i4-40-xdrive': [
    'mercedes-benz-cla-350-4matic',
    'audi-a6-e-tron-sportback-quattro',
    'mercedes-benz-c-400-4matic',
  ],
  'bmw-i4-m60-xdrive': [
    'mercedes-benz-cla-amg-45-4matic',
    'porsche-taycan-plus',
    'volvo-es90-twin-motor-performance',
  ],
  'bmw-i5-edrive40': [
    'lexus-es-350e',
    'volvo-es90-twin-motor',
    'mercedes-benz-c-400-4matic',
  ],
  'bmw-i5-m60-xdrive': [
    'porsche-taycan-4s-plus',
    'porsche-cayenne-s-coupe',
    'polestar-5-performance',
  ],
  'bmw-ix-xdrive-45-sport': [
    'porsche-macan-4-electric',
    'mercedes-benz-eqe-suv-350-4matic',
    'polestar-3-performance',
  ],
  'bmw-ix-xdrive-60-sport': [
    'porsche-cayenne-base',
    'audi-sq6-e-tron-base',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'bmw-ix1-edrive-20': [
    'mini-countryman-e',
    'opel-grandland-base',
    'byd-seal-u-base',
  ],
  'bmw-ix1-xdrive-30': [
    'mercedes-benz-eqa-suv-300-4matic',
    'mini-countryman-se-4x4',
    'volvo-ex40-recharge-twin',
  ],
  'bmw-ix3-40': [
    'polestar-4-suv-long-range-dual-motor',
    'volkswagen-id-7-gtx',
    'tesla-model-y-performance',
  ],
  'bmw-ix3-50-xdrive': [
    'volvo-ex60-p12',
    'mercedes-benz-glc-400-4matic',
    'audi-q6-e-tron-base',
  ],
  'byd-atto-3-evo-base': [
    'hongqi-ehs5-base',
    'xpeng-g6-awd-performance',
    'subaru-uncharted-base',
  ],
  'byd-dolphin-base': [
    'volkswagen-id-3-pro',
    'renault-r5-e-tech-52-kwh',
    'nissan-leaf-standard-range',
  ],
  'byd-seal-base': [
    'tesla-model-3-performance',
    'polestar-2-long-range-dual-motor',
    'mercedes-benz-cla-200',
  ],
  'byd-seal-u-base': [
    'opel-grandland-base',
    'byd-atto-3-evo-base',
    'mazda-cx-6e-78-kwh',
  ],
  'byd-sealion-7-base': [
    'tesla-model-y-long-range-dual-motor',
    'kia-ev6-2025-long-range-awd',
    'hongqi-ehs7-premium',
  ],
  'byd-tang-flagship': [
    'hyundai-ioniq-9-long-range-awd',
    'kia-ev9-base',
    'skoda-peaq-90x',
  ],
  'citroen-e-c4-base': [
    'fiat-600e-base',
    'volkswagen-id-cross-base',
    'renault-scenic-e-tech-ev60',
  ],
  'fiat-500e-base': [
    'mini-aceman-e',
    'hyundai-ioniq-3-standard-range',
    'renault-r5-e-tech-52-kwh',
  ],
  'fiat-600e-base': [
    'citroen-e-c4-base',
    'volkswagen-id-cross-base',
    'jeep-avenger-base',
  ],
  'ford-capri-base': [
    'polestar-2-long-range-dual-motor',
    'tesla-model-3-long-range-fjorhjoladrif',
    'volkswagen-id-4-pro-4motion',
  ],
  'ford-explorer-er-awd': [
    'volkswagen-id-4-pro-4motion',
    'skoda-elroq-85x',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'ford-mustang-mach-e-lr-awd': [
    'tesla-model-y-long-range-dual-motor',
    'kia-ev6-2025-long-range-awd',
    'skoda-enyaq-85x',
  ],
  'ford-puma-base': [
    'mg-mgs5-comfort',
    'peugeot-e-2008-54-kwh',
    'leapmotor-b10-67-1-kwh',
  ],
  'hongqi-ehs5-base': [
    'peugeot-e-3008-base',
    'mazda-cx-6e-78-kwh',
    'skoda-elroq-85x',
  ],
  'hongqi-ehs7-premium': [
    'byd-sealion-7-base',
    'subaru-e-outback-base',
    'tesla-model-y-performance',
  ],
  'hyundai-inster-base': [
    'kia-ev2-standard-range',
    'jac-e30x-base',
    'leapmotor-b03x-promax',
  ],
  'hyundai-inster-long-range': [
    'ford-puma-base',
    'gwm-ora-3-48-kwh',
    'renault-r5-e-tech-base',
  ],
  'hyundai-ioniq-3-standard-range': [
    'renault-r5-e-tech-52-kwh',
    'byd-dolphin-base',
    'peugeot-e-2008-54-kwh',
  ],
  'hyundai-ioniq-3-long-range': [
    'volkswagen-id-3-neo-58-kwh',
    'renault-r5-e-tech-52-kwh',
    'mg-mgs5-lux',
  ],
  'hyundai-ioniq-5-long-range-awd': [
    'kia-ev6-2025-long-range-awd',
    'tesla-model-y-long-range-dual-motor',
    'skoda-enyaq-85x',
  ],
  'hyundai-ioniq-9-long-range-awd': [
    'kia-ev9-base',
    'byd-tang-flagship',
    'xpeng-x9-awd-performance',
  ],
  'hyundai-ioniq-9-long-range-performance-awd': [
    'kia-ev9-gt',
    'volvo-ex90-twin-motor',
    'xpeng-x9-awd-performance',
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
  'jac-e30x-base': [
    'leapmotor-b03x-promax',
    'mg-mg4-urban-long-range',
    'leapmotor-b05-pro',
  ],
  'jac-t9-ev-base': [
    'kgm-musso-ev-4wd',
    'kgm-musso-ev-base',
    'toyota-hilux-base',
  ],
  'jeep-avenger-base': [
    'fiat-600e-base',
    'suzuki-e-vitara-4x4-allgrip',
    'toyota-urban-cruiser-active-fwd',
  ],
  'kgm-musso-ev-base': [
    'jac-t9-ev-base',
    'kgm-torres-evx',
    'leapmotor-c10-promax-awd',
  ],
  'kgm-musso-ev-4wd': ['jac-t9-ev-base', 'toyota-hilux-base', 'kgm-torres-evx'],
  'kgm-torres-evx': [
    'leapmotor-c10-promax',
    'renault-scenic-e-tech-ev60',
    'kgm-musso-ev-base',
  ],
  'kia-ev2-standard-range': [
    'leapmotor-b10-base',
    'opel-frontera-base',
    'gwm-ora-3-48-kwh',
  ],
  'kia-ev2-long-range': [
    'volkswagen-id-polo-base',
    'nissan-leaf-standard-range',
    'leapmotor-c10-pro',
  ],
  'kia-ev3-standard-range': [
    'peugeot-e-2008-54-kwh',
    'volkswagen-id-3-pro',
    'smart-1-pro',
  ],
  'kia-ev3-long-range': [
    'nissan-leaf-extended-range',
    'mazda-6e-long-range',
    'hyundai-kona-electric-65-kwh',
  ],
  'kia-ev3-long-range-awd': [
    'skoda-elroq-85x',
    'subaru-uncharted-base',
    'hongqi-ehs5-base',
  ],
  'kia-ev4-base': [
    'renault-scenic-e-tech-ev87',
    'tesla-model-3-long-range-afturhjoladrif',
    'skoda-elroq-85',
  ],
  'kia-ev4-fastback': [
    'tesla-model-3-long-range-afturhjoladrif',
    'mazda-6e-long-range',
    'nissan-leaf-extended-range',
  ],
  'kia-ev5-base': [
    'toyota-bz4x-touring-base',
    'nissan-ariya-base',
    'tesla-model-y-premium-long-range',
  ],
  'kia-ev5-awd': ['skoda-enyaq-85x', 'nissan-ariya-e-4orce', 'toyota-bz4x-awd'],
  'kia-ev6-2025-long-range-awd': [
    'hyundai-ioniq-5-long-range-awd',
    'tesla-model-y-long-range-dual-motor',
    'nissan-ariya-e-4orce',
  ],
  'kia-ev9-base': [
    'hyundai-ioniq-9-long-range-awd',
    'xpeng-x9-awd-performance',
    'byd-tang-flagship',
  ],
  'kia-ev9-gt': [
    'hyundai-ioniq-9-long-range-performance-awd',
    'volvo-ex90-twin-motor',
    'mercedes-benz-vle-300',
  ],
  'kia-pv5-base': [
    'toyota-proace-city-verso-base',
    'mercedes-benz-eqt-200',
    'peugeot-e-5008-dual-motor',
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
    'jac-e30x-base',
  ],
  'leapmotor-b05-pro': [
    'leapmotor-b03x-promax',
    'mg-mg4-urban-long-range',
    'jac-e30x-base',
  ],
  'leapmotor-b05-promax': [
    'mg-mg4-urban-long-range',
    'leapmotor-b10-base',
    'kia-ev2-standard-range',
  ],
  'leapmotor-b10-base': [
    'kia-ev2-standard-range',
    'opel-frontera-base',
    'mg-mg4-urban-long-range',
  ],
  'leapmotor-b10-67-1-kwh': [
    'kia-ev2-long-range',
    'mg-mgs5-comfort',
    'leapmotor-c10-pro',
  ],
  'leapmotor-c10-pro': [
    'mg-mgs5-lux',
    'skoda-epiq-55',
    'kia-ev3-standard-range',
  ],
  'leapmotor-c10-promax': [
    'hyundai-kona-electric-65-kwh',
    'xpeng-g6-rwd-standard-range',
    'kgm-torres-evx',
  ],
  'leapmotor-c10-promax-awd': [
    'suzuki-e-vitara-4x4-allgrip',
    'smart-1-pulse',
    'xpeng-g6-rwd-standard-range',
  ],
  'lexus-es-350e': [
    'bmw-i5-edrive40',
    'volvo-es90-twin-motor',
    'mercedes-benz-c-400-4matic',
  ],
  'lexus-es-500e': [
    'volvo-es90-twin-motor-performance',
    'bmw-i5-edrive40',
    'porsche-taycan-plus',
  ],
  'lexus-rz-350e': [
    'polestar-3-base',
    'mercedes-benz-glc-300-4matic',
    'audi-q6-e-tron-base',
  ],
  'lexus-rz-500e': [
    'polestar-3-performance',
    'porsche-macan-4-electric',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'lexus-rz-550e-f-sport': [
    'porsche-macan-4s-electric',
    'audi-sq6-e-tron-base',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'lexus-ux-300e': [
    'volvo-ex40-recharge-twin',
    'audi-q4-e-tron-45-quattro',
    'mercedes-benz-eqa-suv-300-4matic',
  ],
  'mazda-6e-long-range': [
    'tesla-model-3-afturhjoladrif',
    'kia-ev4-fastback',
    'nissan-leaf-extended-range',
  ],
  'mazda-cx-6e-78-kwh': [
    'smart-5-pro',
    'xpeng-g6-rwd-long-range',
    'peugeot-e-3008-base',
  ],
  'mercedes-benz-c-400-4matic': [
    'bmw-i4-40-xdrive',
    'audi-a6-e-tron-sportback-quattro',
    'bmw-i5-edrive40',
  ],
  'mercedes-benz-cla-200': [
    'polestar-2-long-range-performance',
    'byd-seal-base',
    'tesla-model-3-long-range-fjorhjoladrif',
  ],
  'mercedes-benz-cla-350-4matic': [
    'bmw-i4-40-xdrive',
    'audi-a6-e-tron-sportback-quattro',
    'tesla-model-3-performance',
  ],
  'mercedes-benz-cla-shooting-brake-350-4matic': [
    'audi-a6-e-tron-avant-quattro',
    'volkswagen-id-7-gtx',
    'volvo-ex60-p10',
  ],
  'mercedes-benz-cla-amg-45-4matic': [
    'bmw-i4-m60-xdrive',
    'porsche-taycan-plus',
    'volvo-es90-twin-motor-performance',
  ],
  'mercedes-benz-eqa-suv-300-4matic': [
    'bmw-ix1-xdrive-30',
    'mini-countryman-se-4x4',
    'audi-q4-e-tron-45-quattro',
  ],
  'mercedes-benz-glb-350-4matic-eq': [
    'skoda-peaq-90x',
    'hyundai-ioniq-9-long-range-awd',
    'byd-tang-flagship',
  ],
  'mercedes-benz-glc-300-4matic': [
    'audi-q6-e-tron-base',
    'bmw-ix3-40',
    'volvo-ex60-p10',
  ],
  'mercedes-benz-glc-400-4matic': [
    'bmw-ix3-50-xdrive',
    'volvo-ex60-p12',
    'audi-q6-e-tron-sportback',
  ],
  'mercedes-benz-eqe-suv-350-4matic': [
    'bmw-ix-xdrive-45-sport',
    'lexus-rz-500e',
    'porsche-macan-4-electric',
  ],
  'mercedes-benz-eqs-580-4matic': [
    'bmw-i5-m60-xdrive',
    'porsche-taycan-4s-plus',
    'range-rover-electric-ev450',
  ],
  'mercedes-benz-eqs-suv-580-4matic': [
    'range-rover-electric-ev450',
    'volvo-ex90-twin-motor-performance',
    'porsche-cayenne-turbo',
  ],
  'mercedes-benz-eqt-200': [
    'toyota-proace-city-verso-base',
    'hyundai-staria-electric-base',
    'kia-pv5-base',
  ],
  'mercedes-benz-eqv-300': [
    'mercedes-benz-vle-300',
    'mercedes-benz-evito-tourer',
    'volkswagen-id-buzz-gtx',
  ],
  'mercedes-benz-vle-300': [
    'mercedes-benz-eqv-300',
    'volkswagen-id-buzz-gtx',
    'kia-ev9-gt',
  ],
  'mercedes-benz-vle-400-4matic': [
    'volvo-ex90-twin-motor-performance',
    'kia-ev9-gt',
    'volkswagen-id-buzz-gtx',
  ],
  'mercedes-benz-g-class-580-eq': [
    'range-rover-electric-ev450',
    'porsche-cayenne-turbo',
    'mercedes-benz-eqs-suv-580-4matic',
  ],
  'mercedes-benz-evito-tourer': [
    'mercedes-benz-eqv-300',
    'toyota-proace-verso-base',
    'peugeot-e-traveller-base',
  ],
  'mg-cyberster-gt': [
    'tesla-model-3-performance',
    'polestar-4-long-range-dual-motor',
    'byd-seal-base',
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
  'mg-mgs5-comfort': [
    'leapmotor-b10-67-1-kwh',
    'ford-puma-base',
    'kia-ev3-standard-range',
  ],
  'mg-mgs5-lux': [
    'kgm-torres-evx',
    'volkswagen-id-cross-base',
    'kia-ev3-long-range',
  ],
  'mg-mgs6-dual-motor': [
    'subaru-uncharted-base',
    'smart-3-pulse',
    'skoda-elroq-85x',
  ],
  'mini-aceman-e': [
    'fiat-500e-base',
    'volvo-ex30-single-motor',
    'fiat-600e-base',
  ],
  'mini-countryman-e': [
    'bmw-ix1-edrive-20',
    'mercedes-benz-eqa-suv-300-4matic',
    'kia-ev5-base',
  ],
  'mini-countryman-se-4x4': [
    'bmw-ix1-xdrive-30',
    'mercedes-benz-eqa-suv-300-4matic',
    'volvo-ex30-cross-country-twin-motor-performance',
  ],
  'nissan-ariya-base': [
    'kia-ev5-base',
    'toyota-bz4x-base',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'nissan-ariya-e-4orce': [
    'toyota-bz4x-awd',
    'kia-ev6-2025-long-range-awd',
    'kia-ev5-awd',
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
    'leapmotor-b10-base',
    'kia-ev2-standard-range',
    'peugeot-e-5008-base',
  ],
  'opel-grandland-base': [
    'byd-seal-u-base',
    'peugeot-e-3008-base',
    'bmw-ix1-edrive-20',
  ],
  'opel-grandland-awd': [
    'peugeot-e-3008-dual-motor',
    'subaru-solterra-base',
    'kia-ev5-awd',
  ],
  'gwm-ora-3-48-kwh': [
    'renault-r5-e-tech-base',
    'hyundai-inster-long-range',
    'kia-ev2-standard-range',
  ],
  'peugeot-e-2008-54-kwh': [
    'kia-ev3-standard-range',
    'ford-puma-base',
    'fiat-600e-base',
  ],
  'peugeot-e-3008-base': [
    'skoda-elroq-85',
    'renault-scenic-e-tech-ev87',
    'hongqi-ehs5-base',
  ],
  'peugeot-e-3008-dual-motor': [
    'opel-grandland-awd',
    'skoda-elroq-85x',
    'volkswagen-id-4-pro-4motion',
  ],
  'peugeot-e-5008-base': [
    'kia-pv5-base',
    'skoda-peaq-90x',
    'mercedes-benz-glb-350-4matic-eq',
  ],
  'peugeot-e-5008-dual-motor': [
    'skoda-peaq-90x',
    'kia-pv5-base',
    'mercedes-benz-glb-350-4matic-eq',
  ],
  'peugeot-e-rifter-base': [
    'toyota-proace-city-verso-base',
    'peugeot-e-5008-base',
    'opel-frontera-base',
  ],
  'peugeot-e-traveller-base': [
    'toyota-proace-verso-base',
    'hyundai-staria-electric-base',
    'mercedes-benz-evito-tourer',
  ],
  'polestar-2-long-range-dual-motor': [
    'tesla-model-3-long-range-fjorhjoladrif',
    'ford-capri-base',
    'byd-seal-base',
  ],
  'polestar-2-long-range-performance': [
    'mercedes-benz-cla-200',
    'tesla-model-3-performance',
    'volvo-ec40-twin-motor',
  ],
  'polestar-3-base': [
    'mercedes-benz-glc-400-4matic',
    'volvo-ex60-p12',
    'lexus-rz-350e',
  ],
  'polestar-3-performance': [
    'porsche-macan-4-electric',
    'bmw-ix-xdrive-45-sport',
    'lexus-rz-500e',
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
  'polestar-5-performance': [
    'bmw-i5-m60-xdrive',
    'porsche-taycan-4s-cross-turismo',
    'porsche-taycan-4s-plus',
  ],
  'porsche-macan-4-electric': [
    'polestar-3-performance',
    'bmw-ix-xdrive-45-sport',
    'mercedes-benz-eqe-suv-350-4matic',
  ],
  'porsche-macan-4s-electric': [
    'bmw-ix-xdrive-45-sport',
    'polestar-3-performance',
    'lexus-rz-550e-f-sport',
  ],
  'porsche-taycan-plus': [
    'mercedes-benz-cla-amg-45-4matic',
    'bmw-i4-m60-xdrive',
    'audi-e-tron-gt-quattro',
  ],
  'porsche-taycan-4-plus': [
    'audi-e-tron-gt-quattro',
    'porsche-cayenne-base',
    'bmw-i4-m60-xdrive',
  ],
  'porsche-taycan-4s-plus': [
    'bmw-i5-m60-xdrive',
    'polestar-5-performance',
    'porsche-cayenne-s',
  ],
  'porsche-taycan-4-cross-turismo': [
    'audi-a6-e-tron-avant-quattro',
    'porsche-cayenne-coupe',
    'bmw-ix-xdrive-60-sport',
  ],
  'porsche-taycan-4s-cross-turismo': [
    'porsche-cayenne-s',
    'bmw-i5-m60-xdrive',
    'audi-a6-e-tron-avant-quattro',
  ],
  'porsche-cayenne-base': [
    'bmw-ix-xdrive-60-sport',
    'audi-sq6-e-tron-base',
    'porsche-macan-4s-electric',
  ],
  'porsche-cayenne-coupe': [
    'bmw-ix-xdrive-60-sport',
    'porsche-taycan-4-cross-turismo',
    'audi-sq6-e-tron-base',
  ],
  'porsche-cayenne-s': [
    'bmw-ix-xdrive-60-sport',
    'porsche-taycan-4s-cross-turismo',
    'range-rover-electric-ev450',
  ],
  'porsche-cayenne-s-coupe': [
    'bmw-ix-xdrive-60-sport',
    'porsche-taycan-4s-cross-turismo',
    'range-rover-electric-ev450',
  ],
  'porsche-cayenne-turbo': [
    'range-rover-electric-ev450',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-suv-580-4matic',
  ],
  'porsche-cayenne-turbo-coupe': [
    'range-rover-electric-ev550',
    'mercedes-benz-g-class-580-eq',
    'mercedes-benz-eqs-580-4matic',
  ],
  'range-rover-electric-ev450': [
    'mercedes-benz-eqs-suv-580-4matic',
    'mercedes-benz-g-class-580-eq',
    'porsche-cayenne-turbo',
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
    'volkswagen-id-polo-base',
    'byd-dolphin-base',
    'hyundai-ioniq-3-standard-range',
  ],
  'renault-scenic-e-tech-ev60': [
    'skoda-elroq-85',
    'xpeng-g6-rwd-standard-range',
    'kgm-torres-evx',
  ],
  'renault-scenic-e-tech-ev87': [
    'xpeng-g6-rwd-long-range',
    'peugeot-e-3008-base',
    'kia-ev4-base',
  ],
  'skoda-epiq-55': [
    'volkswagen-id-polo-base',
    'kia-ev2-long-range',
    'ford-puma-base',
  ],
  'skoda-elroq-85': [
    'xpeng-g6-rwd-long-range',
    'peugeot-e-3008-base',
    'tesla-model-y-standard-range',
  ],
  'skoda-elroq-85x': [
    'kia-ev3-long-range-awd',
    'peugeot-e-3008-dual-motor',
    'volkswagen-id-4-pro-4motion',
  ],
  'skoda-elroq-rs': [
    'volkswagen-id-4-gtx',
    'ford-mustang-mach-e-lr-awd',
    'tesla-model-y-long-range-dual-motor',
  ],
  'skoda-enyaq-85x': [
    'kia-ev5-awd',
    'smart-5-pulse',
    'ford-mustang-mach-e-lr-awd',
  ],
  'skoda-enyaq-rs': [
    'volkswagen-id-4-gtx',
    'smart-5-brabus',
    'audi-q4-e-tron-45-quattro',
  ],
  'skoda-peaq-90x': [
    'peugeot-e-5008-dual-motor',
    'mercedes-benz-glb-350-4matic-eq',
    'byd-tang-flagship',
  ],
  'smart-1-pro': [
    'kia-ev3-standard-range',
    'volvo-ex30-single-motor',
    'mg-mgs5-lux',
  ],
  'smart-1-pulse': [
    'leapmotor-c10-promax-awd',
    'suzuki-e-vitara-4x4-allgrip',
    'volvo-ex30-single-motor',
  ],
  'smart-1-brabus': [
    'volvo-ex30-twin-motor-performance',
    'smart-3-brabus',
    'byd-atto-3-evo-base',
  ],
  'smart-3-pulse': [
    'volvo-ex30-twin-motor-performance',
    'toyota-urban-cruiser-active-awd',
    'mg-mgs6-dual-motor',
  ],
  'smart-3-brabus': [
    'volvo-ex30-twin-motor-performance',
    'smart-1-brabus',
    'xpeng-g6-awd-performance',
  ],
  'smart-5-pro': [
    'xpeng-g6-rwd-standard-range',
    'mazda-cx-6e-78-kwh',
    'tesla-model-y-standard-range',
  ],
  'smart-5-pulse': [
    'skoda-enyaq-85x',
    'ford-mustang-mach-e-lr-awd',
    'kia-ev5-base',
  ],
  'smart-5-brabus': [
    'tesla-model-y-performance',
    'skoda-enyaq-rs',
    'polestar-4-suv-long-range-dual-motor',
  ],
  'subaru-e-outback-base': [
    'toyota-bz4x-touring-awd',
    'byd-sealion-7-base',
    'kgm-musso-ev-4wd',
  ],
  'subaru-solterra-base': [
    'toyota-bz4x-awd',
    'kia-ev6-2025-long-range-awd',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'subaru-uncharted-base': [
    'mg-mgs6-dual-motor',
    'toyota-c-hr-awd',
    'kia-ev3-long-range-awd',
  ],
  'suzuki-e-vitara-4x4-allgrip': [
    'jeep-avenger-base',
    'smart-1-pulse',
    'toyota-urban-cruiser-active-fwd',
  ],
  'tesla-model-3-afturhjoladrif': [
    'mazda-6e-long-range',
    'kia-ev4-fastback',
    'nissan-leaf-extended-range',
  ],
  'tesla-model-3-long-range-afturhjoladrif': [
    'kia-ev4-fastback',
    'mazda-6e-long-range',
    'nissan-leaf-extended-range',
  ],
  'tesla-model-3-long-range-fjorhjoladrif': [
    'polestar-2-long-range-dual-motor',
    'kia-ev4-fastback',
    'byd-seal-base',
  ],
  'tesla-model-3-performance': [
    'byd-seal-base',
    'polestar-2-long-range-performance',
    'mg-cyberster-gt',
  ],
  'tesla-model-y-standard-range': [
    'xpeng-g6-rwd-standard-range',
    'skoda-elroq-85',
    'hyundai-kona-electric-65-kwh',
  ],
  'tesla-model-y-premium-long-range': [
    'skoda-enyaq-85x',
    'toyota-c-hr-77-kwh',
    'kia-ev5-base',
  ],
  'tesla-model-y-long-range-dual-motor': [
    'ford-mustang-mach-e-lr-awd',
    'kia-ev6-2025-long-range-awd',
    'skoda-enyaq-85x',
  ],
  'tesla-model-y-performance': [
    'polestar-4-long-range-dual-motor',
    'smart-5-brabus',
    'hongqi-ehs7-premium',
  ],
  'toyota-bz4x-base': [
    'nissan-ariya-base',
    'kia-ev5-base',
    'subaru-solterra-base',
  ],
  'toyota-bz4x-awd': [
    'subaru-solterra-base',
    'nissan-ariya-e-4orce',
    'kia-ev6-2025-long-range-awd',
  ],
  'toyota-bz4x-touring-base': [
    'subaru-e-outback-base',
    'kia-ev5-base',
    'nissan-ariya-base',
  ],
  'toyota-bz4x-touring-awd': [
    'subaru-e-outback-base',
    'skoda-enyaq-rs',
    'smart-5-brabus',
  ],
  'toyota-c-hr-base': [
    'peugeot-e-3008-base',
    'bmw-ix1-edrive-20',
    'volvo-ex30-single-motor-extended-range',
  ],
  'toyota-c-hr-77-kwh': [
    'tesla-model-y-premium-long-range',
    'nissan-ariya-base',
    'kia-ev5-base',
  ],
  'toyota-c-hr-awd': [
    'subaru-uncharted-base',
    'byd-sealion-7-base',
    'nissan-ariya-e-4orce',
  ],
  'toyota-hilux-base': [
    'jac-t9-ev-base',
    'kgm-musso-ev-4wd',
    'kgm-musso-ev-base',
  ],
  'toyota-proace-city-verso-base': [
    'mercedes-benz-eqt-200',
    'kia-pv5-base',
    'hyundai-staria-electric-base',
  ],
  'toyota-proace-verso-base': [
    'peugeot-e-traveller-base',
    'mercedes-benz-evito-tourer',
    'hyundai-staria-electric-base',
  ],
  'toyota-urban-cruiser-active-fwd': [
    'suzuki-e-vitara-4x4-allgrip',
    'jeep-avenger-base',
    'kia-ev3-long-range',
  ],
  'toyota-urban-cruiser-active-awd': [
    'suzuki-e-vitara-4x4-allgrip',
    'smart-3-pulse',
    'smart-1-pulse',
  ],
  'volkswagen-id-buzz-gtx': [
    'hyundai-ioniq-9-long-range-awd',
    'xpeng-x9-awd-performance',
    'kia-pv5-base',
  ],
  'volkswagen-id-polo-base': [
    'skoda-epiq-55',
    'renault-r5-e-tech-52-kwh',
    'byd-dolphin-base',
  ],
  'volkswagen-id-cross-base': [
    'citroen-e-c4-base',
    'fiat-600e-base',
    'renault-scenic-e-tech-ev60',
  ],
  'volkswagen-id-3-pro': [
    'byd-dolphin-base',
    'kia-ev3-standard-range',
    'hyundai-ioniq-3-long-range',
  ],
  'volkswagen-id-3-neo-58-kwh': [
    'hyundai-ioniq-3-long-range',
    'nissan-leaf-extended-range',
    'kia-ev3-long-range',
  ],
  'volkswagen-id-4-gtx': [
    'skoda-elroq-rs',
    'ford-mustang-mach-e-lr-awd',
    'skoda-enyaq-85x',
  ],
  'volkswagen-id-4-pro-4motion': [
    'ford-explorer-er-awd',
    'xpeng-g6-awd-performance',
    'hyundai-ioniq-5-long-range-awd',
  ],
  'volkswagen-id-7-gtx': [
    'polestar-4-long-range-dual-motor',
    'bmw-ix3-40',
    'audi-a6-e-tron-avant-quattro',
  ],
  'volvo-ec40-twin-motor': [
    'bmw-ix1-xdrive-30',
    'audi-q4-e-tron-45-quattro',
    'polestar-2-long-range-performance',
  ],
  'volvo-es90-twin-motor': [
    'bmw-i5-edrive40',
    'mercedes-benz-c-400-4matic',
    'audi-a6-e-tron-sportback-quattro',
  ],
  'volvo-es90-twin-motor-performance': [
    'mercedes-benz-cla-amg-45-4matic',
    'bmw-i4-m60-xdrive',
    'lexus-es-500e',
  ],
  'volvo-ex40-recharge-twin': [
    'audi-q4-e-tron-45-quattro',
    'bmw-ix1-xdrive-30',
    'lexus-ux-300e',
  ],
  'volvo-ex30-single-motor': [
    'mini-aceman-e',
    'smart-1-pro',
    'kia-ev3-standard-range',
  ],
  'volvo-ex30-single-motor-extended-range': [
    'smart-1-pro',
    'toyota-c-hr-base',
    'mini-countryman-e',
  ],
  'volvo-ex30-twin-motor-performance': [
    'smart-3-pulse',
    'smart-1-brabus',
    'mg-mgs6-dual-motor',
  ],
  'volvo-ex30-cross-country-twin-motor-performance': [
    'mini-countryman-se-4x4',
    'smart-3-brabus',
    'volvo-ex40-recharge-twin',
  ],
  'volvo-ex60-p10': [
    'audi-q6-e-tron-base',
    'bmw-ix3-40',
    'mercedes-benz-glc-300-4matic',
  ],
  'volvo-ex60-p12': [
    'bmw-ix3-50-xdrive',
    'mercedes-benz-glc-400-4matic',
    'audi-q6-e-tron-base',
  ],
  'volvo-ex90-twin-motor': [
    'kia-ev9-gt',
    'hyundai-ioniq-9-long-range-performance-awd',
    'mercedes-benz-vle-300',
  ],
  'volvo-ex90-twin-motor-performance': [
    'kia-ev9-gt',
    'mercedes-benz-vle-400-4matic',
    'porsche-cayenne-base',
  ],
  'xpeng-g6-rwd-standard-range': [
    'tesla-model-y-standard-range',
    'renault-scenic-e-tech-ev60',
    'smart-5-pro',
  ],
  'xpeng-g6-rwd-long-range': [
    'skoda-elroq-85',
    'peugeot-e-3008-base',
    'renault-scenic-e-tech-ev87',
  ],
  'xpeng-g6-awd-performance': [
    'tesla-model-y-long-range-dual-motor',
    'volkswagen-id-4-pro-4motion',
    'skoda-elroq-85x',
  ],
  'xpeng-g9-awd-performance': [
    'volvo-ex60-p10',
    'mercedes-benz-glc-300-4matic',
    'tesla-model-y-performance',
  ],
  'xpeng-x9-awd-performance': [
    'kia-ev9-base',
    'hyundai-ioniq-9-long-range-awd',
    'volkswagen-id-buzz-gtx',
  ],
}

export default similarCars

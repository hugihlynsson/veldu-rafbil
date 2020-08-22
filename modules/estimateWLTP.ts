// An NEDC to WLTP range estimation based on https://insideevs.com/features/343231/heres-how-to-calculate-conflicting-ev-range-test-cycles-epa-wltp-nedc/
const estimateWLTP = (NEDCRange: number): string =>
  (NEDCRange * 0.785).toFixed(0)

export default estimateWLTP

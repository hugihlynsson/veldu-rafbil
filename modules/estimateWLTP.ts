// An NEDC to WLTP range estimation based on https://insideevs.com/features/343231/heres-how-to-calculate-conflicting-ev-range-test-cycles-epa-wltp-nedc/
const estimateWLTP = (NEDCRange: number): number => NEDCRange * 0.785

export default estimateWLTP

/** Phone dimensions and layout constants */
export const PHONE = {
  /** Outer frame dimensions */
  width: 390,
  height: 844,
  /** Border radius of the outer frame */
  borderRadius: 55,
  /** Bezel width */
  bezel: 4,
  /** Screen border radius (slightly smaller than outer) */
  screenRadius: 51,

  /** Status bar height */
  statusBarHeight: 54,
  /** Dynamic Island dimensions */
  dynamicIsland: {
    width: 126,
    height: 37,
    borderRadius: 20,
    top: 11,
  },
  /** Home indicator */
  homeIndicator: {
    width: 134,
    height: 5,
    bottom: 8,
    borderRadius: 3,
  },

  /** Grid layout */
  grid: {
    columns: 4,
    iconSize: 60,
    gap: 24,
    paddingX: 28,
    paddingTop: 20,
    labelGap: 6,
  },

  /** Dock */
  dock: {
    height: 96,
    paddingX: 24,
    paddingBottom: 28,
  },
} as const;

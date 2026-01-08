import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export default function TopBlob() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 249 354"
      preserveAspectRatio="xMinYMin meet"
      pointerEvents="none"
      style={{
        position: "absolute",
        top: -100,
        left: -140,
      }}
    >
      <Defs>
        <LinearGradient
          id="topGrad"
          x1="104"
          y1="-121"
          x2="104"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#7860E3" />
          <Stop offset="1" stopColor="#D66767" />
        </LinearGradient>
      </Defs>

      <Path
        d="M-77 17.6231C-77 -58.9363 -14.9363 -121 61.6231 -121H184.896C230.977 -121 261.018 -72.5915 240.562 -31.2998C233.121 -16.2807 232.065 1.10764 237.634 16.9167L244.76 37.1472C258.136 75.1236 232.53 115.628 192.487 119.832L181.753 120.959C155.176 123.75 135.309 146.662 136.313 173.367L138.128 221.695C139.258 251.771 102.508 267.183 81.8468 245.298C61.0808 223.303 24.1571 238.994 25.5784 269.21L27.277 305.318C28.8875 339.554 -6.16838 363.461 -37.4524 349.461L-46.2762 345.512C-64.9678 337.147 -77 318.581 -77 298.103V17.6231Z"
        fill="url(#topGrad)"
        opacity={0.5}
      />
    </Svg>
  );
}

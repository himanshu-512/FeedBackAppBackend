import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

export default function BottomBlob() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 244 405"
      preserveAspectRatio="xMaxYMax meet"
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: -120,
        right: -90,
      }}
    >
      <Defs>
        <LinearGradient
          id="bottomGrad"
          x1="205.669"
          y1="-23.06"
          x2="206.691"
          y2="504.706"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#7860E3" />
          <Stop offset="1" stopColor="#D66767" />
        </LinearGradient>
      </Defs>

      <Path
        d="M464.2 354.207C464.361 437.049 397.334 504.337 314.491 504.497L58.9721 504.992C11.9836 505.083 -16.0982 452.718 9.9761 413.628C21.479 396.383 23.0441 374.352 14.0947 355.654L11.6263 350.497C-9.21778 306.947 20.1013 256.033 68.2299 252.202L103.731 249.375C136.552 246.762 161.321 218.484 159.587 185.604L158.234 159.943C156.019 117.944 204.228 92.8187 237.387 118.691C270.778 144.746 319.272 119.077 316.502 76.814L315.415 60.2389C312.797 20.2939 351.407 -9.62686 389.435 2.8779L413.207 10.695C443.269 20.5803 463.608 48.6224 463.67 80.2677L464.2 354.207Z"
        fill="url(#bottomGrad)"
        opacity={0.5}
      />
    </Svg>
  );
}

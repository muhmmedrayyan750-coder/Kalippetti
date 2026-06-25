import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text1?: string;
  text2?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  text1 = 'Kali',
  text2 = 'ppetti',
}) => {
  const dimensions = {
    sm: { width: 130, height: 42 },
    md: { width: 170, height: 55 },
    lg: { width: 230, height: 75 },
  };

  const dim = dimensions[size];
  const fullText = text1 + text2;
  // Dynamically size smile based on text length
  const smileStart = 105 + Math.max(0, (fullText.length - 10) * 3);
  const smileEnd = 175 + Math.max(0, (fullText.length - 10) * 3);

  return (
    <div className={`kalippetti-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 220 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <text
          x="10"
          y="42"
          fontFamily="'Outfit', 'Comfortaa', 'Arial Rounded MT Bold', sans-serif"
          fontWeight="800"
          fontSize="36px"
          letterSpacing="-0.5px"
        >
          <tspan fill="#7026b9">{text1}</tspan>
          <tspan fill="#ff6b00">{text2}</tspan>
        </text>
        {/* Smile curve */}
        <path
          d={`M ${smileStart} 45 C ${smileStart + 15} 56, ${smileEnd - 15} 56, ${smileEnd} 45`}
          stroke="#ff6b00"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
export default Logo;

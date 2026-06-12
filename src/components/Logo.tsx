import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: { width: 130, height: 42 },
    md: { width: 170, height: 55 },
    lg: { width: 230, height: 75 },
  };

  const dim = dimensions[size];

  return (
    <div className={`kalippetti-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 200 60"
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
          <tspan fill="#7026b9">Kali</tspan>
          <tspan fill="#ff6b00">ppetti</tspan>
        </text>
        {/* Smile curve under the 'etti' letters */}
        <path
          d="M 105 45 C 120 56, 160 56, 175 45"
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

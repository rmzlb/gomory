'use client'

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Minimalist geometric representation of cutting optimization */}
      {/* Main square */}
      <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Vertical cut */}
      <line x1="16" y1="4" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
      
      {/* Horizontal cuts */}
      <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
      <line x1="16" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
      
      {/* Optimized pieces - filled rectangles */}
      <rect x="6" y="6" width="8" height="4" fill="currentColor" opacity="0.2" />
      <rect x="6" y="14" width="8" height="12" fill="currentColor" opacity="0.15" />
      <rect x="18" y="6" width="8" height="12" fill="currentColor" opacity="0.25" />
      <rect x="18" y="22" width="8" height="4" fill="currentColor" opacity="0.1" />
    </svg>
  )
}

export function LogoMark({ size = 24, className = '' }: LogoProps) {
  // Even simpler version for small spaces
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="10" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
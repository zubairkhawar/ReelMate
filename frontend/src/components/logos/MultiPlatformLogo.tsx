interface MultiPlatformLogoProps {
  className?: string
  size?: number
}

export default function MultiPlatformLogo({ className = '', size = 24 }: MultiPlatformLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="multi-platform-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill="url(#multi-platform-gradient)"
      />
      <circle cx="8" cy="8" r="2" fill="url(#multi-platform-gradient)" />
      <circle cx="16" cy="8" r="2" fill="url(#multi-platform-gradient)" />
      <circle cx="8" cy="16" r="2" fill="url(#multi-platform-gradient)" />
      <circle cx="16" cy="16" r="2" fill="url(#multi-platform-gradient)" />
    </svg>
  )
}

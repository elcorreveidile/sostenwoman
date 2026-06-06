'use client'

import { useState } from 'react'

export default function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {src && !failed && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <span className="text-stone-400 text-sm">Sin imagen</span>
    </div>
  )
}

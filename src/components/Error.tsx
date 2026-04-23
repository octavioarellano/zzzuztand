import React from 'react'

const Error = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-red-400 text-sm mt-1 font-semibold">
        {children}
    </p>
  )
}

export default Error
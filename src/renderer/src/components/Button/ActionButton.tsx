import { ComponentProps } from 'react'

export const ActionButton = ({ className, children, ...props }: ComponentProps<'button'>) => {
  const twStyles = `px-2 py-1 rounded-md border border-blue-700 bg-blue-500 text-white rounded hover:bg-blue-600 ${className ?? ''}`
  return (
    <button className={twStyles} {...props}>
      {children}
    </button>
  )
}

import { ComponentProps, forwardRef } from 'react'

export const RootLayout = ({ className, children, ...props }: ComponentProps<'main'>) => {
  const twStyles = `flex flex-row h-screen w-screen ${className ?? ''}`

  return (
    <main className={twStyles} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  const twStyles = `w-[250px] mt-10 h-[100vh + 10px] overflow-auto ${className ?? ''}`

  return (
    <aside className={twStyles} {...props}>
      {children}
    </aside>
  )
}

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => {
    const twStyles = `flex-1 overflow-auto ${className ?? ''}`

    return (
      <div ref={ref} className={twStyles} {...props}>
        {children}
      </div>
    )
  }
)

Content.displayName = 'Content'

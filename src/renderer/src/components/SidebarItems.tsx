import { ComponentProps } from 'react'

export const SidebarItems = ({ ...props }: ComponentProps<'ul'>) => {
  return (
    <ul {...props}>
      <li className="bg-red-500">Reportes</li>
      <li>Registros</li>
    </ul>
  )
}

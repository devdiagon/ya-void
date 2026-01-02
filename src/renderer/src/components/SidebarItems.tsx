import { ComponentProps } from 'react'
import { useFarms } from '../hooks/useFarms'

export const SidebarItems = ({ ...props }: ComponentProps<'ul'>) => {
  const { farms, loading, error } = useFarms()

  return (
    <ul {...props}>
      <li className="font-bold text-gray-600">Fincas</li>

      {loading && <li className="text-sm text-gray-400">Cargando...</li>}

      {error && <li className="text-sm text-red-500">{error}</li>}

      {farms.map((farm) => (
        <li key={farm.id} className="cursor-pointer rounded px-2 py-1 hover:bg-gray-200">
          {farm.name}
        </li>
      ))}
    </ul>
  )
}

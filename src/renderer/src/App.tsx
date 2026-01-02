import { Content, RootLayout, Sidebar, SidebarItems } from './components'

function App(): React.JSX.Element {
  return (
    <RootLayout>
      <Sidebar className="p-2 border-4 border-red-500">
        <SidebarItems className="mt-4 space-y-1" />
      </Sidebar>
      <Content className="border-4 border-blue-500">Contet</Content>
    </RootLayout>
  )
}

export default App

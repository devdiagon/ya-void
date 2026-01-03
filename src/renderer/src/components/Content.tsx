export const Content = ({ children }) => {
  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">{children}</div>
    </main>
  );
}
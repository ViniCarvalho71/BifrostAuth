import './App.css'
import AppRoutes from './routes'
import { AlertProvider } from './Contexts/AlertContext'

function App() {
  return (
    <AlertProvider>
      <AppRoutes />
    </AlertProvider>
  )
}

export default App

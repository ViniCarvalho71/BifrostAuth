import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import UsuariosPage from './Pages/UsuariosPage'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/usuarios" element={<UsuariosPage />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes

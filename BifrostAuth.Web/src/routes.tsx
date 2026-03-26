import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import UsuariosPage from './Pages/UsuariosPage'
import ProtectedRoute from './Components/ProtectedRoute'
import SidebarLayout from './Components/SidebarLayout'
import DashboardPage from './Pages/DashboardPage'
import ApplicationPage from './Pages/ApplicationPage'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/authorize" element={<LoginPage />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<SidebarLayout />
						</ProtectedRoute>
					}
				>
					<Route path="/painel" element={<DashboardPage />} />
					<Route path="/usuarios" element={<UsuariosPage />} />
					<Route path="/aplicacoes" element={<ApplicationPage />} />
				</Route>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes

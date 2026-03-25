import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import UsuariosPage from './Pages/UsuariosPage'
import ProtectedRoute from './Components/ProtectedRoute'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/authorize" element={<LoginPage />} />
				<Route
					path="/usuarios"
					element={
						<ProtectedRoute>
							<UsuariosPage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes

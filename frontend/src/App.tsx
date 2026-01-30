import './App.css'
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom'
import Reservations from './pages/Reservations'
import Login from './pages/Login'

/**
 * Default global style
 */
const RootLayout = () => {
  return(
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Outlet />
    </div>
  )
}

/**
 * Creating the routes
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/reservations",
        element: <Reservations />
      },
    ]
  },
]);


function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

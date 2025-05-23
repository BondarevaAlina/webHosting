import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import Main from './Components/Main/Main'
import User from './Components/User/User'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main/>
      },
      {
        path: '/user',
        element: <User/>
      }
    ]
  },
  {
    path: '*',
    element: <div style={{ padding: '2rem' }}>Ошибка 404: Страница не найдена</div>
  }
])

export default router
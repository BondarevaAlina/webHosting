import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import Main from './Components/Main/Main'
import User from './Components/User/User'
import ChannelPage from './Components/ChannelPage/ChannelPage'
import CoursePage from './Components/CoursePage/CoursePage'
import OKAK from './Components/OKAK/OKAK'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />
      },
      {
        path: '/user',
        element: <User />
      },
      {
        path: '/channel/:id',
        element: <ChannelPage />
      },
      {
        path: '/course/:id',
        element: <CoursePage />
      }

    ]
  },
  {
    path: '*',
    element: <OKAK />
  }
])

export default router
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import Chatpage from './components/Chatpage';
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'



const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes> <MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: "/profile/:id",
        element: <Profile />
      }, {
        path: "/account/edit",
        element: <EditProfile />
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><Chatpage /></ProtectedRoutes>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])




function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio)
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8080", {
        query: {
          userId: user?._id
        },
        transports: ["websocket"]
      });
      dispatch(setSocket(socketio));

      // listen the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch])


  return (
    <>

      <RouterProvider router={browserRouter} />

    </>
  )
}

export default App

import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/page.jsx'
import Performance from './pages/performance/page.jsx'
import Profile from './pages/profile/page.jsx'
import Workouts from './pages/workouts/page.jsx'
import Auth from './pages/auth/page.jsx'
import Exercises from './pages/exercises/page.jsx'
import NewWorkout from './pages/newWorkout/page.jsx'
import Portal from './pages/portal/page.jsx'

import { WorkoutProvider } from './contexts/useWorkoutContext.jsx'

const pages = createBrowserRouter([  
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home />},
      { path: '/performance', element: <Performance />},
      { path: '/profile', element: <Profile />},
      { path: '/workouts', element: <Workouts />},
      { path: '/auth', element: <Auth />},
      { path: '/exercises', element: <Exercises />},
      { path: '/newWorkout', element: <NewWorkout />},
      { path: '/portal', element: <Portal />}

    ]

  }

]) 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkoutProvider>
      <RouterProvider router={pages}> </RouterProvider>
    </WorkoutProvider>
  </StrictMode>,
)

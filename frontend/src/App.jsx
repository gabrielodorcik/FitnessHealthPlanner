import Navbar from "./components/navbar/navbar.jsx"
import { Outlet } from "react-router-dom"
import Footer from "./components/footer/footer.jsx"
import { WorkoutProvider } from "./contexts/useWorkoutContext.jsx"
import { useState } from "react"

import FloatingButton from './components/assistant/assistant.jsx'
import FHPHelpChat from './components/assistant/fhpHelp.jsx'

import { BiMessageDetail } from 'react-icons/bi'


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function App() {
 const [showChat, setShowChat] = useState(false)

  return (
    <>
    <WorkoutProvider>

      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
      <ToastContainer position="top-right" autoClose={1300} theme="colored" />
      <FloatingButton onClick={() => setShowChat(prev => !prev)} icon={<BiMessageDetail />} label="FHP Help" />
      {showChat && <FHPHelpChat onClose={() => setShowChat(false)} />}

    </WorkoutProvider>
    
      
    </>
  )
}



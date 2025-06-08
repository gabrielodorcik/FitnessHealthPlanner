import Navbar from "./components/navbar/navbar.jsx"
import { Outlet } from "react-router-dom"
import Footer from "./components/footer/footer.jsx"
import { WorkoutProvider } from "./contexts/useWorkoutContext.jsx"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return (
    <>
    <WorkoutProvider>

      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>

    </WorkoutProvider>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
    </>
  )
}



import Navbar from "./components/navbar/navbar.jsx"
import { Outlet } from "react-router-dom"
import Footer from "./components/footer/footer.jsx"
import { WorkoutProvider } from "./contexts/useWorkoutContext.jsx"

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
      
    </>
  )
}



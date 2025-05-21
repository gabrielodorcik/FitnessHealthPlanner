import { createContext, useContext, useState } from "react";

const WorkoutContext = createContext()

export function WorkoutProvider({ children }) {

    const [ workoutItems, setWorkoutItems] = useState([])

    const addToWorkout = (itemToAdd) => {
        const checkItemAlready = workoutItems.find((workoutItem) => {
            return workoutItem._id === itemToAdd._id
        })

        if(!checkItemAlready){
            itemToAdd.quantity = 1

            setWorkoutItems([...workoutItems, itemToAdd])
            console.log('Exercicio Adicionado!')
        } else{
            console.log('Esse exercicio já está na sua lista')
        }
        
        

    }

    const removeFromWorkout = (itemId) => {
        const workoutItemsSanitized = workoutItems.filter((item) => {
            return item._id !== itemId
        })
        setWorkoutItems(workoutItemsSanitized)
    }

    const updateFromWorkout = (items) => {
        setWorkoutItems(items)
    }

    const clearWorkout = () => {
        setWorkoutItems([])
    }

    return (
        <WorkoutContext.Provider value={{ removeFromWorkout, addToWorkout, workoutItems, updateFromWorkout, clearWorkout}}>
            {children}
        </WorkoutContext.Provider>
    )
}

export const useWorkoutContext = () => {
    const context = useContext(WorkoutContext)

    if(!context) {
        console.log('You are out of WorkoutContext')
    }

    return context
}
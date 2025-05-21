import { useState } from "react"

export default function exerciseServices(){
    const [exerciseLoading, setExerciseLoading] = useState(false)
    const [refetchExercises, setRefetchExercises] = useState(true)
    const [exercisesList, setExercisesList] = useState([])

    const url = 'http://localhost:3000/exercises'
    //const url = 'https://fhpbackend-f4guexf7cbg0etbb.canadacentral-01.azurewebsites.net/exercises'
    
    const getAvailableExercises = (userId) => {
        setExerciseLoading(true)

        fetch(`${url}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success){
                setExercisesList(result.body)
            } else {
                console.log(result)
            }
            

        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setExerciseLoading(false)
            setRefetchExercises(false)
        })
    }


    return { getAvailableExercises, exerciseLoading, refetchExercises, exercisesList }

}
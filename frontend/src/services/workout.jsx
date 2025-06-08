// services/workout.js
import { useState, useEffect} from "react"

export default function useWorkoutServices() {
    const [workoutLoading, setWorkoutLoading] = useState(false)
    const [refetchWorkouts, setRefetchWorkouts] = useState(true)
    const [workoutsList, setWorkoutsList] = useState([])

    const url = 'http://localhost:3000/workouts'
    // const url = 'https://fhpbackend-f4guexf7cbg0etbb.canadacentral-01.azurewebsites.net/workouts'

    const getUserWorkouts = (userId) => {
        setWorkoutLoading(true)
        return fetch(`${url}/userworkouts/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Resposta API getUserWorkouts:", result);
                const data = result.body || []
                setWorkoutsList(data)
                return data
            })
            .catch((error) => {
                console.error("Erro na requisição getUserWorkouts:", error)
                setWorkoutsList([])
                return []
            })
            .finally(() => {
                setWorkoutLoading(false)
                setRefetchWorkouts(false)
            })
    }

    const sendWorkout = (workoutData, userId) => {
        setWorkoutLoading(true)
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(workoutData)
        })
            
            .then(async (response) => {
            const result = await response.json();

            if (!response.ok) {
                console.error("Erro HTTP:", response.status, result);
                return;
            }

            if (result.success) {
                console.log("Treino criado com sucesso:", result);
                getUserWorkouts(userId);
            } else {
                console.warn("Erro na resposta da API:", result);
            }
        })
        .catch((error) => {
            console.error("Erro na requisição:", error);
        })
        .finally(() => {
            setWorkoutLoading(false);
        });

    }

    const deleteWorkout = (id) => {
        return fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
    }

    const updateWorkout = async (id, workoutData) => {
        try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workoutData)
        })
        if (!response.ok) {
            throw new Error("Erro ao atualizar treino");
        }

        const data = await response.json();
        return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    const updateWorkoutStatusController = async (workoutId, status) => {
        try {
            const response = await fetch(`${url}/${workoutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pickupStatus: status }),
            });

            if (!response.ok) {
            throw new Error('Erro ao atualizar status do treino');
            }

            const data = await response.json();
            console.log('Status atualizado:', data);
            // Atualize a tela, se necessário
        } catch (error) {
            console.error('Erro ao atualizar status do treino:', error);
        }
    };

    return {
        getUserWorkouts,
        workoutLoading,
        refetchWorkouts,
        workoutsList,
        setRefetchWorkouts,
        sendWorkout,
        deleteWorkout,
        updateWorkout, 
        updateWorkoutStatusController
    }
}

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import authServices from '../../services/auth'
import workoutServices from "../../services/workout"
import styles from './page.module.css'
import { BiLogOut } from "react-icons/bi";
import Loading from "../loading/page"
import CompleteProfilePopup from "../../components/completeprofilePopup/completeprofilePopup"

export default function Profile() {
    const { logout, completeProfile } = authServices()
    const { getUserWorkouts, workoutLoading, refetchWorkouts, workoutsList } = workoutServices()
    const navigate = useNavigate()

    const [showPopup, setShowPopup] = useState(false)
    const [authData, setAuthData] = useState(JSON.parse(localStorage.getItem('auth')))

    useEffect(() => {
        if (!authData) {
            navigate('/auth')
        } else if (refetchWorkouts) {
            getUserWorkouts(authData?.user?._id)
        }
    }, [authData, refetchWorkouts])

    if (workoutLoading) return <Loading />

    const handleLogout = () => {
        logout()
        navigate('/auth')
    }

    const handleCompleteProfile = async (formData) => {
        try {
            const response = await completeProfile(authData.user._id, formData)

            const updatedAuth = {
                ...authData,
                user: {
                    ...authData.user,
                    ...response, // <-- usa os dados atualizados
                    profileCompleted: true
                }
            }

            localStorage.setItem('auth', JSON.stringify(updatedAuth))
            setAuthData(updatedAuth)
            setShowPopup(false)
        } catch (err) {
            console.error("Erro ao atualizar:", err)
        }
    }
    console.log("Dados do usuário:", authData.user);

    const updateWorkoutStatus = async (workoutId, status) => {
        try {
            const response = await fetch(`/api/workouts/${workoutId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pickupStatus: status })
            })

            if (!response.ok) {
            throw new Error("Erro ao atualizar status")
            }

            alert("Treino movido para edição com sucesso.")
        } catch (error) {
            console.error(error)
            alert("Erro ao mudar status do treino.")
        }
    }


    return (
        <div className={styles.pageContainer}>
            <div className={styles.nameContainer}>
                <h1>Perfil</h1>
                <button onDoubleClick={handleLogout}>Logout <BiLogOut /></button>
            </div>

            <div className={styles.userData}>
                <p><strong>Nome completo:</strong> {authData?.user?.fullname}</p>
                <p><strong>Email:</strong> {authData?.user?.email}</p>

                {authData?.user?.profileCompleted && (
                    <>
                        <p><strong>Altura:</strong> {authData?.user?.height} cm</p>
                        <p><strong>Peso:</strong> {authData?.user?.weight} kg</p>
                        <p><strong>Academia:</strong> {authData?.user?.gym}</p>
                        {authData?.user?.role === 'aluno' && <p><strong>CPF:</strong> {authData?.user?.cpf}</p>}
                        {authData?.user?.role === 'profissional' && <p><strong>CREF:</strong> {authData?.user?.cref}</p>}
                        <p><strong>Data de Nascimento:</strong> {authData?.user?.birthDate}</p>
                        {authData?.user?.role === 'aluno' && <p><strong>Profissional:</strong> {authData?.user?.professionalId?.fullname}</p>}
                        {authData?.user?.role === 'profissional' && <p><strong>Alunos:</strong> {authData?.user?.cref}</p>}
                    </>
                )}

                <button onClick={() => setShowPopup(true)}>
                    {authData?.user?.profileCompleted ? 'Editar dados' : 'Terminar cadastro'}
                </button>
            </div>

            {showPopup && (
                <CompleteProfilePopup
                    userId={authData?.user?._id}
                    onClose={() => setShowPopup(false)}
                    onUpdate={(newData) => {
                        const updated = {
                            ...authData,
                            user: {
                                ...authData.user,
                                ...newData,
                                profileCompleted: true
                            }
                        }
                        localStorage.setItem('auth', JSON.stringify(updated))
                        setAuthData(updated)
                        setShowPopup(false)
                    }}
                    initialData={authData?.user}
                />
            )}
        </div>
    )
}

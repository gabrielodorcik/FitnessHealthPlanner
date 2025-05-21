import { useWorkoutContext } from "../../contexts/useWorkoutContext"
import styles from './page.module.css'
import { FiMinusCircle } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmWorkoutPopup from "../../components/confirmWorkoutPopup/confirmWorkoutPopup";
import workoutServices from "../../services/workout";

export default function NewWorkout() {
    const { workoutItems, updateFromWorkout, removeFromWorkout, clearWorkout } = useWorkoutContext()
    const [confirmPopupOpen, setConfirmPopupOpen] = useState(false)
    const { sendWorkout, getUserWorkouts } = workoutServices()
    const navigate = useNavigate();
    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [hasPendingWorkout, setHasPendingWorkout] = useState(false)
    const [editingWorkoutLoaded, setEditingWorkoutLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const authData = JSON.parse(localStorage.getItem('auth'))
    const userId = authData?.user?._id

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('auth'));
        
        if (!authData) {
            navigate('/auth');
            return;
        }

        async function fetchWorkouts() {
            try {
                const workouts = await getUserWorkouts(userId);
                console.log("Treinos retornados:", JSON.stringify(workouts, null, 2));
                console.log("Treinos do usuário:", workouts);

                const hasPending = workouts?.some(
                     w => w.pickupStatus === 'Em andamento' && w.createdBy === userId
                );
                

                const editingWorkout = workouts?.find(
                    w => w.pickupStatus === 'Editando' && w.createdBy === userId
                );

                console.log('Treinos com status Editando criados pelo usuário:', workouts.filter(
                w => w.pickupStatus === 'Editando' && w.createdBy === userId
                ));

                setHasPendingWorkout(hasPending);

                if (editingWorkout && editingWorkout.workoutItems) {
                    //setEditingWorkoutId(editingWorkout._id);

                    const preparedItems = editingWorkout.workoutItems.map(item => {
                        const details = item.itemDetails?.[0];
                        if (!details) return null;

                        return {
                            _id: item.exerciseId,
                            name: details.name,
                            muscleGroup: details.muscleGroup,
                            label: details.label,
                            imgUrl: details.imgUrl,
                            reps: item.reps || 1,
                            restTime: item.restTime,
                            sets: item.sets,
                            weight: item.weight
                        };
                    }).filter(Boolean);

                    setWorkoutItems(preparedItems)

                }

            } catch (err) {
                console.error('Erro ao buscar workouts', err);
            } finally {
                setLoading(false);
            }
        }

        fetchWorkouts();
    }, []);

    const handleChangeItemReps = (mode, itemId) => {
        const updatedWorkoutItem = workoutItems.map((item) => {
            if (item._id === itemId) {
                if (mode === 'less' && item.reps > 1) {
                    item.reps -= 1;
                } else if (mode === 'more') {
                    item.reps += 1;
                }
            }
            return item;
        });

        updateFromWorkout(updatedWorkoutItem);
    };

    const handleOpenPopup = (e) => {
        e.preventDefault();
        setConfirmPopupOpen(!confirmPopupOpen);
    };

    const handleConfirmWorkout = async (workoutData) => {
        workoutData.items = workoutItems.map((item) => ({
            exerciseId: item._id,
            reps: item.reps
        }));

        try {
            if (editingWorkoutId) {
                await workoutServices().updateWorkout(editingWorkoutId, workoutData);
            } else {
                await sendWorkout(workoutData, userId);
            }

            clearWorkout();
            setConfirmPopupOpen(false);
            setEditingWorkoutId(null);
            navigate('/workouts');
        } catch (err) {
            console.error("Erro ao confirmar treino:", err);
        }
    };

    if (loading) return <p>Carregando...</p>;

    if (!workoutItems.length && !editingWorkoutId) {
        return (
            <div>
                <h2>Você já tem um treino pendente.</h2>
                <p>Finalize ou cancele o treino atual antes de criar um novo.</p>
            </div>
        );
    }

    if (!hasPendingWorkout && editingWorkoutId && !editingWorkoutLoaded) {
        const isEditing = editingWorkoutId !== null;
        return (

            <div>
                <h2>Você está editando um treino existente!</h2>
                <p>Adicione, edite ou remova os exercícios antes de confirmar.</p>
            </div>
        );
    }

    if (!workoutItems.length) {
        return (
            <div>
                <h1>Você ainda não adicionou exercícios ao seu treino</h1>
                <Link to={'/exercises'} className={styles.navbarLink}>Veja os exercícios disponíveis!</Link>
            </div>
        );
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <h1>Criar um treino!</h1>
                {isEditing && (
                    <div className={styles.editingWarning}>
                        <h2>Você está editando um treino existente!</h2>
                        <p>Adicione, edite ou remova os exercícios antes de confirmar.</p>
                    </div>
                )}
                <section>
                    <div className={styles.itemsListContainer}>
                        {workoutItems.map((item) => (
                            <div className={styles.itemContainer} key={item._id}>
                                <img src={item.imgUrl} alt="" />
                                <div className={styles.itemContent}>
                                    <h2>{item.name}</h2>
                                    <p>[{String(item.muscleGroup)}]</p>
                                    <div className={styles.minusPlusContainer}>
                                        <button onClick={() => handleChangeItemReps('less', item._id)}> <FiMinusCircle /></button>
                                        <button onClick={() => handleChangeItemReps('more', item._id)}><FaRegSquarePlus /></button>
                                    </div>
                                    <button onClick={() => removeFromWorkout(item._id)} > <RiDeleteBin5Fill /> Remover</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <button className={styles.confirmBtn} onClick={handleOpenPopup}>Confirmar o treino!</button>
            </div>

            <ConfirmWorkoutPopup
                open={confirmPopupOpen}
                onClose={handleOpenPopup}
                onConfirm={handleConfirmWorkout}
            />
        </>
    );
}

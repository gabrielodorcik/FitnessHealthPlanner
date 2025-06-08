import { useWorkoutContext } from "../../contexts/useWorkoutContext"
import styles from './page.module.css'
import { FiMinusCircle } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmWorkoutPopup from "../../components/confirmWorkoutPopup/confirmWorkoutPopup";
import workoutServices from "../../services/workout";
import { toast } from 'react-toastify';

export default function NewWorkout() {
    const { workoutItems, updateFromWorkout, removeFromWorkout, clearWorkout, setWorkoutItems } = useWorkoutContext();
    const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
    const { sendWorkout, getUserWorkouts } = workoutServices();
    const navigate = useNavigate();
    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [hasPendingWorkout, setHasPendingWorkout] = useState(false);
    const [loading, setLoading] = useState(true);
   

    const authData = JSON.parse(localStorage.getItem('auth'));
    const userId = authData?.user?._id;
    const userName = authData?.user?.fullname || "";
    const userRole = authData?.user?.role || "";


    const [selectedGroup, setSelectedGroup] = useState("all");
    const [selectedRoutine, setSelectedRoutine] = useState("all");

    const filteredWorkoutItems = workoutItems.filter(item => {
    const groupMatch = selectedGroup === "all" || item.muscleGroup === selectedGroup;
    const routineMatch = selectedRoutine === "all" || item.routineLetter === selectedRoutine;
    return groupMatch && routineMatch;
    });


    useEffect(() => {
        if (!authData) {
            navigate('/auth');
            return;
        }

        async function fetchWorkouts() {
            try {
                const workouts = await getUserWorkouts(userId);

                let hasPending = false;
                let editingWorkout = null;

                for (const w of workouts) {
                    if (w.pickupStatus === 'Em andamento' && w.userDetails?.[0]?._id === userId) {
                        hasPending = true;
                    }
                    if (
                        w.pickupStatus === 'Editando' &&
                        ((typeof w.createdBy === 'string' && w.createdBy === userId) || (w.createdBy?._id === userId))
                    ) {
                        editingWorkout = w;
                    }
                }

                setHasPendingWorkout(hasPending);

                if (editingWorkout) {
                    setEditingWorkoutId(editingWorkout._id);

                    const preparedItems = editingWorkout.workoutItems.map(item => {
                        const details = item.itemDetails?.[0] || (typeof item.exerciseId === 'object' ? item.exerciseId : null);
                        if (!details) return null;

                        return {
                            _id: details._id,
                            name: details.name,
                            muscleGroup: details.muscleGroup,
                            label: details.label,
                            imgUrl: details.imgUrl,
                            reps: item.reps || 1,
                            restTime: item.restTime,
                            sets: item.sets,
                            weight: item.weight,
                            routineLetter: item.routineLetter || ""
                        };
                    }).filter(Boolean);

                    setWorkoutItems(preparedItems);
                } else {
                    // Se não estiver editando, e houver treino em andamento, limpamos o contexto
                    if (hasPending) {
                        clearWorkout();
                    }
                }
            } catch (err) {
                console.error('Erro ao buscar workouts', err);
            } finally {
                setLoading(false);
            }
        }

        if (userId) fetchWorkouts();
    }, []);


    useEffect(() => {
        if (hasPendingWorkout && !editingWorkoutId && workoutItems.length > 0) {
            clearWorkout();
        }
    }, [hasPendingWorkout, editingWorkoutId, clearWorkout, workoutItems]);

    const handleInputChange = (field, itemId, value) => {
        const updatedWorkoutItems = workoutItems.map((item) => {
            if (item._id === itemId) {
                return {
                    ...item,
                    [field]: field === 'routineLetter' ? value : Number(value)
                };
            }
            return item;
        });
        updateFromWorkout(updatedWorkoutItems);
    };


    useEffect(() => {
      const handleBeforeUnload = (e) => {
        if (workoutItems.length > 0) {
          e.preventDefault();
          e.returnValue = "Você perderá os exercícios adicionados. Deseja continuar?";
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [workoutItems]);


    const handleChangeItemSeries = (mode, itemId) => {
        const updatedWorkoutItems = workoutItems.map((item) => {
            if (item._id === itemId) {
                let newSets = item.sets || 1;
                if (mode === 'less' && newSets > 1) newSets--;
                if (mode === 'more') newSets++;
                return { ...item, sets: newSets };
            }
            return item;
        });
        updateFromWorkout(updatedWorkoutItems);
    };

    const handleOpenPopup = (e) => {
        e.preventDefault();
        setConfirmPopupOpen(!confirmPopupOpen);
    };

    const handleConfirmWorkout = async (workoutData) => {
        workoutData.items = workoutItems.map((item) => ({
            exerciseId: item._id,
            reps: item.reps,
            restTime: item.restTime,
            sets: item.sets,
            weight: item.weight,
            label: item.routineLetter || null
        }));

        console.log("Workout enviado:", workoutData);

        try {
            if (editingWorkoutId) {
            await workoutServices().updateWorkout(editingWorkoutId, workoutData);
            toast.success("Treino atualizado com sucesso!");
            } else {
            await sendWorkout(workoutData, userId);
            toast.success("Treino criado com sucesso!");
            }

            clearWorkout();
            setConfirmPopupOpen(false);
            setEditingWorkoutId(null);
            navigate('/workouts');
        } catch (err) {
            console.error("Erro ao criar/atualizar treino:", err);
            toast.error("Erro ao criar ou atualizar o treino.");
        }
    };


    console.log("loading:", loading);
    console.log("hasPendingWorkout:", hasPendingWorkout);
    console.log("editingWorkoutId:", editingWorkoutId);
    console.log("workoutItems:", workoutItems);

    if (loading) return <p>Carregando...</p>;

    if (!loading && hasPendingWorkout && !editingWorkoutId) {
        return (
            <div>
                <h2>Você já tem um treino em andamento.</h2>
                <p>Finalize ou cancele o treino atual antes de criar um novo.</p>
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
                <h1>{editingWorkoutId ? "Editando treino" : "Criar um treino!"}</h1>

                {editingWorkoutId && (
                    <div className={styles.editingWarning}>
                        <h2>Você está editando um treino existente!</h2>
                        <p>Adicione, edite ou remova os exercícios antes de confirmar.</p>
                    </div>
                )}

                <div className={styles.filtersContainer}>
                    <label>Filtrar por grupo muscular:</label>
                    <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value="all">Todos</option>
                        {[...new Set(workoutItems.map(item => item.muscleGroup))].map(group => (
                        <option key={group} value={group}>{group}</option>
                        ))}
                    </select>

                    <label>Filtrar por rotina:</label>
                    <select value={selectedRoutine} onChange={(e) => setSelectedRoutine(e.target.value)}>
                        <option value="all">Todas</option>
                        {[...new Set(workoutItems.map(item => item.routineLetter).filter(Boolean))].map(routine => (
                        <option key={routine} value={routine}>{routine}</option>
                        ))}
                    </select>
                </div>


                <section>
                    <div className={styles.itemsListContainer}>
                        {filteredWorkoutItems.map((item) => (
                            <div className={styles.exerciseCard} key={item._id}>
                            <img src={item.imgUrl} alt={item.name} className={styles.exerciseImage} />

                            <div className={styles.exerciseContent}>
                                <div className={styles.exerciseHeader}>
                                <h2>{item.name}</h2>
                                <span className={styles.muscleGroup}>[{item.muscleGroup}]</span>
                                </div>

                                <div className={styles.exerciseInputs}>
                                <div className={styles.inputGroup}>
                                    <label>Repetições 
                                    <input
                                    type="number"
                                    min={1}
                                    value={item.reps}
                                    onChange={(e) => handleInputChange('reps', item._id, e.target.value)}
                                    /> </label>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Séries
                                    <div className={styles.seriesControl}>
                                    <button onClick={() => handleChangeItemSeries('less', item._id)}><FiMinusCircle /></button>
                                    <span>{item.sets}</span>
                                    <button onClick={() => handleChangeItemSeries('more', item._id)}><FaRegSquarePlus /></button>
                                    </div> </label>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Descanso (segundos)</label>
                                    <input
                                    type="number"
                                    min={0}
                                    value={item.restTime || 60}
                                    onChange={(e) => handleInputChange('restTime', item._id, e.target.value)}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Rotina</label>
                                    <select
                                    value={item.routineLetter || ""}
                                    onChange={(e) => handleInputChange('routineLetter', item._id, e.target.value)}
                                    >
                                    <option value="">Selecione</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    </select>
                                </div>
                                </div>

                                <button className={styles.removeButton} onClick={() => removeFromWorkout(item._id)}>
                                <RiDeleteBin5Fill /> Remover
                                </button>
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

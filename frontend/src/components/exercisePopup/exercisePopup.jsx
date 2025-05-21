import { Dialog } from "@mui/material";
import styles from './exercisePopup.module.css'

export default function ExercisePopup({exerciseData, onClose, onAddToWorkout}){
    return (
        <Dialog open={true} onClose={onClose}>

            <div className={styles.popupContainer}>
                <img src={exerciseData.imgUrl} alt="" />
                <div className={styles.popuContent}>
                    <h2>{exerciseData.name}</h2>
                    <p>{exerciseData.muscleGroup}</p>
                    <button onClick={() => {onAddToWorkout(exerciseData)}}> Adicione ao seu Treino </button>
                </div>
            </div>

        </Dialog>
    )
}
import styles from './exerciseCard.module.css'

export default function ExerciseCard({ exerciseData }) {

    return (

        <>
        
            <div className={styles.cardContainer}>
                <img src={exerciseData.imgUrl} alt="" />

                <div className={styles.cardContent}>

                    <h4> {exerciseData.name}</h4>
                    <p> {exerciseData.muscleGroup}</p>

                </div>

            </div>

        </>

    )
}


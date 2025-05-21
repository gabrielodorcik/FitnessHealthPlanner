import Dialog from "@mui/material/Dialog";
import styles from './confirmWorkoutPopup.module.css'
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { duration } from "@mui/material";

export default function ConfirmWorkoutPopup({open, onClose, onConfirm}){

    const [ formData, setFormData] = useState(null)
    const authData = JSON.parse(localStorage.getItem('auth'))
    const navigate = useNavigate()

    const handleConfirm = (e) => {
        e.preventDefault()

        if(!authData?.user?._id){
            return navigate('/auth')
        } else {
            if(!formData?.duration){
                return
            }else{
                const workoutData = {
                    userId: authData?.user?._id,
                    duration: formData?.duration
                }
                
                onConfirm(workoutData)

            }
        }
        
    }

    const handleForDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }


    return (

        

        <Dialog open={open} onClose={onClose}>

            <div className={styles.popupContainer}>
                <h2>Estamos quase lá...</h2>
                <p>Confirme o seu treino com a atual data: <strong>{(new Date()).toLocaleDateString()}</strong>. Qual a programação de tempo para essse treino?</p>
                    <form className={styles.formContainer}>
                        <TextField
                        
                        onChange={handleForDataChange}
                        required
                        type="date"
                        name="duration"
                        

                        />
                        <div className={styles.confirmBtn}>
                            <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>

                            <button onClick={handleConfirm}> Confirmar</button>

                        </div>

                    </form>
                
            </div>

        </Dialog>
    )
}
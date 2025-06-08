import styles from './checkinPopup.module.css'
import { useState , useEffect} from "react";


export default function CheckinPopup({ onClose, onSubmit }) {
  const [result, setResult] = useState(null)
  const [observation, setObservation] = useState("")

  const handleConfirm = () => {
    onSubmit({ result, observation })
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Treino realizado com sucesso?</h2>

        <div className={styles.buttonGroup}>
          <button 
            className={result === true ? styles.selected : ''}
            onClick={() => setResult(true)}
          >
            Sim
          </button>
          <button 
            className={result === false ? styles.selected : ''}
            onClick={() => setResult(false)}
          >
            Não
          </button>
        </div>

        <textarea
          placeholder="Observações (opcional)"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />

        <div className={styles.actions}>
          <button onClick={handleConfirm} disabled={result === null}>Confirmar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

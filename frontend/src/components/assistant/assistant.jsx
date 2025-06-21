import React from 'react'
import styles from './assistant.module.css'

export default function FloatingButton({ onClick, icon, label }) {
  return (
    <div className={styles.floatingButton} onClick={onClick}>
      {icon && <span className="icon">{icon}</span>}
      {label && <span className="label">{label}</span>}
    </div>
  )
}

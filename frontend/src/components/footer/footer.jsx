import styles from './footer.module.css'
import {Link } from 'react-router-dom'

export default function Footer(){
    return (
        <footer className={styles.footerContainer}>
            <img src="/imgs/logo.png" alt="" />

            <div>
                <h2>Links Importantes</h2>
                <div className={styles.linksContainer}>
                    <Link className={styles.link} to={'/exercises'}>Exercises</Link>
                    <Link className={styles.link} to={'/profile'}>Profile</Link>
                    <Link className={styles.link} to={'/performance'}>Performance</Link>
                    <Link className={styles.link} to={'/'}>Home</Link>
                </div>
            </div>

            <div className={styles.footerContainer} >
                <h4 className={styles.brother}> Em memória de Sandro Felipe Odorcik, meu querido irmão. </h4>
            </div>
            
        </footer>
    )
}
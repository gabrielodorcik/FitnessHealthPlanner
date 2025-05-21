import styles from './navbar.module.css'
import { BiDumbbell, BiSolidUser, BiMenu, BiSolidDashboard } from "react-icons/bi";
import { Drawer } from '@mui/material'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

    const [ openMenu, setOpenMenu] = useState(false)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return (
        <nav className={styles.navbarConteiner}>

            <div className={styles.navbarItems}>
                <Link to={'/'}>
                    <img className={styles.logo} src="/imgs/logo.png" alt="" />
                </Link>
                
                <div className={styles.navbarLinksContainer}>
                    <Link to={'/'} className={styles.navbarLink}>Home</Link>
                    <Link to={'/workouts'} className={styles.navbarLink}>Treinos</Link>
                    <Link to={'/exercises'} className={styles.navbarLink}>Exercicios</Link>
                    <Link to={'/newWorkout'} className={styles.navbarLink}>Criar Treino</Link>
                    <Link to={'/performance'}>
                        <BiSolidDashboard className={styles.navbarLink}/>
                    </Link>
                    <Link to={'/profile'}>
                        <BiSolidUser className={styles.navbarLink}/>
                    </Link>
                    
                </div>

            </div>

            <div className={styles.mobileNavBarItems}>
                <Link to={'/'}>
                    <img className={styles.logo} src="/imgs/logo.png" alt="" />
                </Link>

                <div className={styles.mobileNavbarBtns}>
                    <Link to={'/performance'}>
                        <BiSolidDashboard className={styles.navbarLink}/>
                    </Link>
                    <BiMenu className={styles.navbarLink} onClick={handleOpenMenu}/>
                    
                </div>

            </div>

            <Drawer
            anchor='right'
            open={openMenu}
            onClose={handleOpenMenu}
           
            >
                <div className={styles.drawer}>
                    <Link to={'/'} className={styles.navbarLink} onClick={handleOpenMenu}>Home</Link>
                    <Link to={'/workouts'} className={styles.navbarLink} onClick={handleOpenMenu}>Treinos</Link>
                    <Link to={'/profile'} className={styles.navbarLink} onClick={handleOpenMenu}>Profile</Link>
                    <Link to={'/exercises'} className={styles.navbarLink} onClick={handleOpenMenu}>Exercicios</Link>
                    <Link to={'/newWorkout'} className={styles.navbarLink} onClick={handleOpenMenu}>Criar treino</Link>
                    
                    

                </div>
                
            
            </Drawer>

        </nav>
    )
}
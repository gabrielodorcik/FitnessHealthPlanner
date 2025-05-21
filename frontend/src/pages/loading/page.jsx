import { CircularProgress} from '@mui/material'
import styles from './page.module.css'

export default function Loading() {
    return (
        <div className={styles.loadingPageContainer}>

            <CircularProgress color='inherited'></CircularProgress>

        </div>
    )
}
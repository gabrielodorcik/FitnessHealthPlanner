import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import authServices from '../../services/auth'
import workoutServices from "../../services/workout"
import styles from './page.module.css'
import { BiLogOut } from "react-icons/bi"
import Loading from "../loading/page"
import CompleteProfilePopup from "../../components/completeprofilePopup/completeprofilePopup"
import defaultAvatar from "/imgs/default-avatar.png"

export default function Profile() {
  const { logout, completeProfile } = authServices()
  const { getUserWorkouts, workoutLoading, refetchWorkouts } = workoutServices()
  const navigate = useNavigate()

  const [showPopup, setShowPopup] = useState(false)
  const [authData, setAuthData] = useState(JSON.parse(localStorage.getItem('auth')))
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    if (!authData) {
      navigate('/auth')
    } else if (refetchWorkouts) {
      getUserWorkouts(authData?.user?._id)
    }
  }, [authData, refetchWorkouts])

  if (!authData || !authData.user || workoutLoading) return <Loading />

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        // Aqui você pode preparar para enviar ao backend futuramente
      }
      reader.readAsDataURL(file)
    }
  }

  const user = authData.user


    const formatPhone = (phone) => {
      if (!phone) return ""
      return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    }

    const formatCEP = (cep) => {
      if (!cep) return ""
      return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2")
    }

    const formatCPF = (cpf) => {
      if (!cpf) return ""
      return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
    }


    const formatCREF = (cref) => {
      if (!cref) return ""
      return cref.replace(/\D/g, "").padStart(6, "0") // apenas números, 6 dígitos
    }


    const formatDateBR = (dateString) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }



  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Perfil</h1>
        <div className={styles.buttonGroup}>
            <button onDoubleClick={handleLogout}>Logout <BiLogOut /></button>
         <button onClick={() => setShowPopup(true)} >
            {user.profileCompleted ? 'Editar dados' : 'Terminar cadastro'}
          </button>
        </div>
        
      </div>

      <div className={styles.profileGrid}>
        {/* Coluna esquerda */}
        <div className={styles.leftColumn}>
          <div className={styles.avatarBox}>
            <img
              src={profileImage || user.photoUrl || defaultAvatar}
              alt="Foto de perfil"
              className={styles.avatar}
            />
            <label className={styles.uploadLabel}>
              Trocar foto
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className={styles.basicInfo}>
            <p><strong>Nome:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Função:</strong> {user.role}</p>
            {user.role === 'aluno' && <p><strong>Profissional:</strong> {user.professionalId?.fullname}</p>}
            {user.role === 'profissional' && <p><strong>Alunos:</strong> {user.cref}</p>}
          </div>
        </div>

        {/* Coluna direita */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <h2>Resumo do Perfil</h2>
            <p><strong>Altura:</strong> {user.height} cm</p>
            <p><strong>Peso:</strong> {user.weight} kg</p>
            
            <p><strong>Data de Nascimento:</strong> {formatDateBR(user.birthDate)}</p>

          </div>

          <div className={styles.section}>
            <h2>Contato</h2>
            
                <p><strong>Telefone:</strong> {formatPhone(user.phone)}</p>
                <p><strong>CEP:</strong> {formatCEP(user.cep)}</p>

          </div>

          <div className={styles.section}>
            <h2>Documentos</h2>
            
            {user.role === 'aluno' && <p><strong>CPF:</strong> {formatCPF(user.cpf)}</p>}
            {user.role === 'profissional' && <p><strong>CREF:</strong> {formatCREF(user.cref)}</p>}

          </div>

         
        </div>
      </div>

      {showPopup && (
        <CompleteProfilePopup
          userId={user._id}
          onClose={() => setShowPopup(false)}
          onUpdate={(newData) => {
            const updated = {
              ...authData,
              user: {
                ...user,
                ...newData,
                profileCompleted: true
              }
            }
            localStorage.setItem('auth', JSON.stringify(updated))
            setAuthData(updated)
            setShowPopup(false)
          }}
          initialData={user}
        />
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Dialog } from "@mui/material"
import styles from './completeProfilePopup.module.css'
import authServices from '../../services/auth'

function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i)
  let check1 = (sum * 10) % 11
  if (check1 === 10) check1 = 0
  if (check1 !== parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i)
  let check2 = (sum * 10) % 11
  if (check2 === 10) check2 = 0
  if (check2 !== parseInt(cpf.charAt(10))) return false

  return true
}

function formatCPF(value) {
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return value
}

function formatCREF(value) {
  value = value.toUpperCase()
  value = value.replace(/[^0-9P\/SP]/g, '')
  if (value.length > 6) {
    value = value.slice(0, 6) + '-' + value.slice(6)
  }
  return value
}

function isValidCREF(cref) {
  return /^[0-9]{6}-P\/SP$/.test(cref.toUpperCase())
}

export default function CompleteProfilePopup({ userId, onClose, onUpdate, initialData = {} }) {
  const { updateUserProfile, getProfessionals } = authServices()
  const [professionals, setProfessionals] = useState([])
  const [errors, setErrors] = useState({})
  const [userInfo, setUserInfo] = useState(null)

  const authData = JSON.parse(localStorage.getItem('auth'))
  const userRole = authData?.user?.role

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    height: '',
    weight: '',
    gym: '',
    cpf: '',
    cref: '',
    birthDate: '',
    professionalId: '',
  })

  useEffect(() => {
    setFormData({
      fullname: initialData?.fullname || '',
      email: initialData?.email || '',
      height: initialData?.height || '',
      weight: initialData?.weight || '',
      gym: initialData?.gym || '',
      cpf: initialData?.cpf ? formatCPF(initialData.cpf) : '',
      cref: initialData?.cref || '',
      birthDate: initialData?.birthDate || '',
      professionalId: initialData?.professionalId || '',
    })
  }, [initialData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProfessionals()
        setProfessionals(result)
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    let { name, value } = e.target

    if (name === 'cpf') {
      value = formatCPF(value)
    }

    if (name === 'cref') {
      value = formatCREF(value)
    }

    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullname.trim()) newErrors.fullname = 'Nome é obrigatório.'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.'

    // if (userRole === 'aluno') {
    //   if (!formData.cpf) {
    //     newErrors.cpf = 'CPF é obrigatório.'
    //   } else if (!isValidCPF(formData.cpf.replace(/\D/g, ''))) {
    //     newErrors.cpf = 'CPF inválido.'
    //   }
    // }

    // if (userRole === 'profissional') {
    //   if (!formData.cref) {
    //     newErrors.cref = 'CREF é obrigatório.'
    //   } else if (!isValidCREF(formData.cref)) {
    //     newErrors.cref = 'CREF inválido. Formato esperado: 000000-P/SP'
    //   }
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = async () => {
    if (!validate()) return

    const updatedData = {
      ...formData,
      cpf: formData.cpf ? formData.cpf.replace(/\D/g, '') : '',
      cref: formData.cref || '',
      profileCompleted: true,
    }

    if (userRole === 'aluno') {
      delete updatedData.cref
    } else {
      delete updatedData.cpf
      delete updatedData.professionalId
    }

    try {
      await updateUserProfile(userId, updatedData)
      const { password, ...dadosSemSenha } = updatedData
      setUserInfo(dadosSemSenha)
      onUpdate(updatedData)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    }
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <div className={styles.popupContainer}>
        <h2>{initialData?.profileCompleted ? 'Editar Dados' : 'Terminar Cadastro'}</h2>

        <div className={styles.formGroup}>
          <div className={styles.formItem}>
            <label>Nome Completo</label>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
            {errors.fullname && <span className={styles.error}>{errors.fullname}</span>}
          </div>

          <div className={styles.formItem}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.formItem}>
            <label>Peso (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          </div>

          <div className={styles.formItem}>
            <label>Altura (cm)</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} />
          </div>

          <div className={styles.formItem}>
            <label>Data de Nascimento</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} disabled={!!initialData?.birthDate} />
          </div>

          <div className={styles.formItem}>
            <label>Academia</label>
            <input type="text" name="gym" value={formData.gym} onChange={handleChange} />
          </div>

          {(userRole || '').toLowerCase() === 'aluno' && (
            <>
              <div className={styles.formItem}>
                <label>CPF</label>
                <input
                  type="text"
                  name="cpf"
                  maxLength={14}
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  disabled={!!initialData?.cpf}
                  
                />
                {errors.cpf && <span className={styles.error}>{errors.cpf}</span>}
              </div>

              <div className={styles.formItem}>
                <label>Profissional (opcional)</label>
                <select
                  name="professionalId"
                  value={formData.professionalId.fullname}
                  onChange={handleChange}
                >
                  <option value="">Nenhum</option>
                  {professionals.map(prof => (
                    <option key={prof._id} value={prof._id}>
                      {prof.fullname || prof.email}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {(userRole || '').toLowerCase() === 'profissional' && (
            <div className={styles.formItem}>
              <label>CREF</label>
              <input
                type="text"
                name="cref"
                maxLength={10}
                value={formData.cref}
                onChange={handleChange}
                placeholder="000000-P/SP"
                disabled={!!initialData?.cref}
              />
              {errors.cref && <span className={styles.error}>{errors.cref}</span>}
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button className="cancel" onClick={onClose}>Cancelar</button>
          <button className="confirm" onClick={handleConfirm}>Confirmar</button>
        </div>

        {userInfo && (
          <div className={styles.userInfoDisplay}>
            <h3>Dados salvos:</h3>
            <ul>
              {Object.entries(userInfo).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Dialog>
  )
}

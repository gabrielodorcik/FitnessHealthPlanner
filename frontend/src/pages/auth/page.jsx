import { useState, useEffect} from "react"
import { TextField, Button } from "@mui/material"
import styles from './auth.module.css'
import authServices from "../../services/auth"
import { useNavigate } from "react-router-dom"
import { BiLogIn } from "react-icons/bi";
import Loading from "../loading/page"
import { IconButton, InputAdornment } from "@mui/material"
import { AlignHorizontalCenter, Visibility, VisibilityOff } from "@mui/icons-material"

import { toast } from 'react-toastify';



export default function Auth() {

    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const [ formType, setFormType] = useState('login')
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: "aluno", // valor padrão
    })
    const { login, signup, authLoading, resetPassword } = authServices()

    const navigate = useNavigate()

    const authData = JSON.parse(localStorage.getItem('auth'))


    useEffect(() => {
        if(authData) {
           navigate('/portal')
        }

    }, [authData, navigate])

    const handleChangeFormType = (type) => {
        
        setErrorMessage(null)
        setFormData({})
        setFormType(type)

    }


    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };


    const [loginAttempts, setLoginAttempts] = useState(0);





    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    
    
const handleSubmitForm = async (e) => {
      e.preventDefault();
      setErrorMessage(null);

      try {
        if (formType === 'login') {
          if (!isValidEmail(formData.email)) {
            toast.error('Por favor, insira um e-mail válido.');
            return;
          }

          try {
            await login(formData);
            toast.success('Login realizado com sucesso!');
            setLoginAttempts(0); // resetar tentativas
            navigate('/portal');
          } catch (error) {
            setLoginAttempts((prev) => prev + 1);

            const errorMsg = error.message?.toLowerCase() || '';

            if (errorMsg.includes('usuário') || errorMsg.includes('não encontrado')) {
              toast.error('Este e-mail não está cadastrado.');
            } else if (errorMsg.includes('senha')) {
              toast.error('Senha incorreta.');
            } else {
              toast.error('Erro ao fazer login.');
            }

            if (loginAttempts + 1 >= 3) {
              toast.info('Esqueceu sua senha? Considere redefini-la.');
            }
          }

        } else if (formType === 'signup') {
          if (!isValidEmail(formData.email)) {
            toast.error('Por favor, insira um e-mail válido.');
            return;
          }

          if (formData.password.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
          }

          if (formData.password !== formData.confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
          }

          await signup(formData);
          toast.success('Cadastro realizado com sucesso!');
          navigate('/portal');

        } else if (formType === 'resetPassword') {


          if (!isValidEmail(formData.email)) {
            toast.error('Por favor, insira um e-mail válido.');
            return;
          }

          await resetPassword(formData);
          toast.info('Se o e-mail existir, um link foi enviado para redefinir a senha.');
          setFormType('login');
        }
      } catch (error) {
        toast.error(error.message || 'Erro ao processar.');
      }
    };



    if(authLoading) {
        return ( <Loading />)

    }

    return ( 
        <div className={styles.authPageContainer}>
            {formType === 'login' ? (
                <>
                    <h1>Login</h1>

                    {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}

                    {/* <button onClick={handleChangeFormType}>Você não tem uma conta? Clique aqui!</button> */}

                     

                    <form onSubmit={handleSubmitForm}>

                        
                        <TextField
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField
                        required
                        fullWidth
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleFormDataChange}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                        <div style={{alignItems: 'center'}}>
                            <button className={styles.submitBtn} type="submit" >Login <BiLogIn /></button>
                        </div>
                        

                        <p style={{ marginTop: '1rem' }}> Esqueceu a senha?{' '}
                            <button className={styles.resetBtn} type="button" onClick={() => handleChangeFormType('resetPassword')}>
                                Redefinir senha
                            </button>
                        </p>

                        <p style={{ marginTop: '1rem' }}> Você não tem uma conta?{' '}
                            <button className={styles.signupBtn} type="button" onClick={() => handleChangeFormType('signup')}>
                                Cadastrar
                            </button>
                        </p>
                        
                    </form>
                </>
                ) : null}

            {formType === 'signup' ? (
                <>
                    <h1>Cadastro</h1>

                    {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}

                     

                    <form onSubmit={handleSubmitForm}>

                        <div className={styles.roleSelector}>
                            <label>Você é:</label>
                            <div className={styles.roleButtons}>
                                <button
                                    type="button"
                                    className={formData.role === "aluno" ? styles.activeRole : ""}
                                    onClick={() => setFormData({ ...formData, role: "aluno" })}
                                >
                                    Aluno
                                </button>
                                <button
                                    type="button"
                                    className={formData.role === "profissional" ? styles.activeRole : ""}
                                    onClick={() => setFormData({ ...formData, role: "profissional" })}
                                >
                                    Profissional
                                </button>
                            </div>
                        </div>



                        <TextField
                        required
                        fullWidth
                        label="Nome Completo"
                        type="fullname"
                        name="fullname"
                        onChange={handleFormDataChange}
                        />
                        <TextField
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                        />
                        <TextField
                        required
                        fullWidth
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleFormDataChange}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                        <TextField
                        rrequired
                        fullWidth
                        label="Confirme a Senha"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        onChange={handleFormDataChange}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                        <div style={{alignItems: 'center'}}>
                            <button type="submit" className={styles.signupBtn} >Cadastrar <BiLogIn /></button>
                        </div>
                            

                        <p style={{ marginTop: '1rem' }}> Você já tem uma conta?{' '}
                            <button type="button" onClick={() => handleChangeFormType('login')}>
                                Login
                            </button>
                        </p>

                    </form>
                </>
            ) : null }
            {formType === 'resetPassword' && (
                 <>
                
                    <h1>Redefinir Senha</h1>
                    <div style={{ width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'flex-end' , padding: '1em',}}>
                        <button className={styles.submitBtn} onClick={() => handleChangeFormType('login')}>
                        Voltar ao login
                        </button>
                    </div>

                    <form onSubmit={handleSubmitForm}>
                    <TextField
                        required
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleFormDataChange}
                    />
                     <TextField
                        required
                        label="Nova senha"
                        type="password"
                        name="password"
                        onChange={handleFormDataChange}
                    />

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <div>
                        <button type="submit" className={styles.resetBtn} >Redefinir senha</button>
                    </div>
                    
                    </form>
                </>
                )}
        </div>   
        

    )

}

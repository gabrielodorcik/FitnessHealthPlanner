import styles from './page.module.css'
import Dessert from '../../../public/imgs/homepage/gymPuller'
import Dumbbell from '../../../public/imgs/homepage/dumbbell'
import GymBar from '../../../public/imgs/homepage/gymBar'
import { VscGithubInverted } from "react-icons/vsc";
import { BiLogoGmail, BiLogoLinkedinSquare } from "react-icons/bi";



export default function Home() {
    return (
        
        <div className={styles.pageContainer}>
            <section>

                <h1>Bem vindo ao Hitness & Health Planner! </h1>

                <p>O FHP é o seu novo companheiro de treinos, onde vai possibilitar mais agilidade e facilidade no
                    no seu dia a dia, trazendo mais foco , fornecendo uma solução mais sustentável! O nosso sistema 
                    é um controle de treinos, especializados ou não, que fornece uma interface intuitiva e promete te auxiliar no dia a dia
                    e também 
                </p>

            </section>

            <section className={styles.bodyHomeSection}>

                <div>
                    <i><Dessert /></i>
                    <h4>Onde surgiu a ideia?</h4>
                    <p>Um belo dia, na academia, durante o meu treino, me veio a mente, porque não criar um sisteminha para gerenciar
                        os meus treinos? Deve ser fácil, pensei eu...
                    </p>
                </div>
                <div>
                    <i><Dumbbell /></i>
                    <h4>Desafios</h4>
                    <p>Desenvolver um projeto onde você só tem uma ideia do que você quer junto ao TCC, parecia perfeito, porém não era
                        o que eu imaginava... Os desafios do desenvolvimento foram dificeis, mas incriveis ao mesmo tempo.
                    </p>
                    
                </div>
                <div>
                    <i><GymBar /></i>
                    <h4>Objetivo</h4>
                    <p>O meu maior objetivo, era ter um sistema funcional, que resolve-se o problema e que depois de colcoar em prática o meu conhecimento,
                        minhas skills e experiências eu alcançaria isso. Bom o resultado foi mais do que o esperado!
                    </p>
                </div>


            </section>

            <div>
                <h2>Desafios</h2>
                    <p>Desenvolver o FHP foi mais complexo do que eu imaginava, não só a parte técnica mas sim eu cai em uma cilada filosófica:
                        Eu não posso fornecer treinos a ninguem, pois não sou especialista, deixar os usuários criarem os proprios treinos seria
                        uma solução, mas eu queria adicionar algo com mais responsabilidade, então eu pensei em fazer um sistema onde poderia ser usado por
                        professores e alunos,  um aluno gerenciado pelo professor e tambem a versatilidade para os alunos.
                    </p>
            </div>

            <section className={styles.contactSection}>

                <h1>Fitness & Health Planner é mais do que apenas um simples app, ele é um conceito!</h1>
               
                <div>
                    <h3>Meus contatos</h3>
                    <div className={styles.socialButtonContainer}>
                        <a  href="https://github.com/gabrielodorcik"><button className={styles.socialButton}> <VscGithubInverted /> Github</button></a>
                        <a  href="https://www.linkedin.com/in/gabrielodorcik"><button className={styles.socialButton}> <BiLogoLinkedinSquare/>Linkedin</button></a>
                        <a  href="mailto:gabrielodorcik@gmail.com"><button className={styles.socialButton}> <BiLogoGmail /> Gmail</button></a>

                    </div>
                </div>

                 


            </section>

            

        </div>
    )
}
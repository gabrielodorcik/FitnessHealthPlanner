# 🏋️‍♂️ FitnessHealthPlanner

Este repositório contém o projeto **FitnessHealthPlanner**, desenvolvido como trabalho final de curso. Trata-se de um sistema web construído com a **stack MERN** (MongoDB, Express.js, React.js e Node.js), com o objetivo de auxiliar usuários na organização de suas rotinas de treino e no acompanhamento de metas de saúde.

## 📌 Funcionalidades

- Cadastro e login de usuários (Aluno ou Profissional)
- Criação e gerenciamento de treinos por alunos e para alunos
- Realização de check-in diário
- Visualização de dados via Dashboards
- Interface responsiva (desktop e mobile)
- Armazenamento seguro de dados no MongoDB


## 🚀 Como executar o projeto localmente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB instalado e em execução local
- Git


### Passo a passo


#### 1. Clone o repositório

```bash
git clone https://github.com/gabrielodorcik/FitnessHealthPlanner.git
cd FitnessHealthPlanner
```

#### 2. Instale as dependências
#### Backend
```bash 
cd backend
npm install
```
#### Frontend
```bash 
cd ../frontend
npm install
```

#### Configure o MongoDB Atlas
Vá para a page do Mongodb Atlas > Crie um novo projeto > Crie um novo cluster > Ele vai pedir pela forma de conexão e você seleciona network access. > copie a URL fornecida. 

```bash
MONGO_CS='mongodb+srv://<seu_user>:<sua_senha><seu_cluster_config>'
MONGO_DB_NAME='<nome_do_cluster>'
```

#### Inicie o projeto
#### Backend
```bash 
cd backend
npm start
```
#### Frontend
```bash 
cd ../frontend
npm start
```

#### A aplicação estará disponível em http://localhost:3000.

## 🧪 Tecnologias utilizadas

- Frontend: React.js, Axios, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, 
- Outros: Git, Thunder Client, dotenv, Docker

## 👤 Autor

Gabriel Odorcik gabrielodorcik@gmail.com

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se livre para usar, modificar e contribuir.

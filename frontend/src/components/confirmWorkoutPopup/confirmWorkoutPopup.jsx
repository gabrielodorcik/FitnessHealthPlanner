import Dialog from "@mui/material/Dialog";
import styles from './confirmWorkoutPopup.module.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/auth"; // Assumindo que já existe

export default function ConfirmWorkoutPopup({ open, onClose, onConfirm, workoutItems = [], editingWorkout = null }) {
  const authData = JSON.parse(localStorage.getItem('auth'));
  const userName = authData?.user?.fullname || "";
  const userRole = authData?.user?.role?.toLowerCase() || "";

  const { getStudents } = authServices();

  const [students, setStudents] = useState([]);

  const [muscleGroups] = useState([
    "Peito", "Costas", "Quadriceps", "Bíceps", "Tríceps", "Ombros", "Abdômen",
  ]);

  const [formData, setFormData] = useState({
    workoutName: "",
    description: "",
    type: "",
    muscleFocus: [],
    createdAt: "",
    duration: "",
    createdBy: userName,
    assignedBy: userRole === "aluno" ? userName : "",
    assignedStudentId: "",
  });

  const [selectedMuscle, setSelectedMuscle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      createdBy: userName || "",
      assignedBy: userRole === "aluno" ? userName : prev.assignedBy,
    }));
  }, [userName, userRole]);

  useEffect(() => {
    if (userRole === "profissional") {
      getStudents().then(setStudents).catch(console.error);
    }
  }, [userRole]);

  useEffect(() => {
    if (editingWorkout) {
      setFormData({
        workoutName: editingWorkout.workoutName || "",
        description: editingWorkout.description || "",
        type: editingWorkout.type || "",
        muscleFocus: editingWorkout.muscleFocus?.split(',') || [],
        createdAt: editingWorkout.createdAt?.slice(0, 10) || "",
        duration: editingWorkout.duration?.slice(0, 10) || "",
        createdBy: editingWorkout.createdBy?.fullname || userName,
        assignedBy: editingWorkout.assignedBy || "",
        assignedStudentId: editingWorkout.assignedToId || "",
      });
    }
  }, [editingWorkout]);

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!authData?.user?._id) return navigate('/auth');

    if (!formData?.duration || !formData?.createdAt || formData.muscleFocus.length === 0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!workoutItems || workoutItems.length === 0) {
      alert("Você precisa adicionar exercícios ao treino antes de confirmar.");
      return;
    }

    const isProfessor = userRole === "profissional";
    const userId = isProfessor ? formData.assignedStudentId : authData?.user?._id;
    const assignedToId = isProfessor ? authData?.user?._id : null;

    if (!userId) {
      alert("Selecione um aluno para atribuir o treino.");
      return;
    }

    const workoutData = {
      userId,
      assignedToId,
      workoutName: formData.workoutName,
      description: formData.description,
      type: formData.type,
      muscleFocus: formData.muscleFocus.join(','),
      createdAt: formData.createdAt,
      duration: formData.duration,
      createdBy: formData.createdBy,
      assignedBy: formData.assignedBy,
      pickupStatus: "Em andamento",
      workoutItems
    };

    onConfirm(workoutData);
  };

  const handleForDataChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addMuscleFocus = () => {
    if (selectedMuscle && !formData.muscleFocus.includes(selectedMuscle)) {
      setFormData((prev) => ({
        ...prev,
        muscleFocus: [...prev.muscleFocus, selectedMuscle],
      }));
      setSelectedMuscle("");
    }
  };

  const removeMuscleGroup = (group) => {
    setFormData(prev => ({
      ...prev,
      muscleFocus: prev.muscleFocus.filter(item => item !== group)
    }));
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          margin: 0,
          borderRadius: '12px',
          overflowX: 'hidden',
          padding: 0,
          maxHeight: '90vh', 
        }
      }}
    >
      <div className={styles.popupContainer}>
        <h2>Estamos quase lá...</h2>
        <p>Confirme o seu treino com as datas desejadas:</p>

        <form className={styles.formContainer} onSubmit={handleConfirm}>
          <div className={styles.dateRow}>
            <label>
              Treino começa em:
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleForDataChange}
                required
                disabled={!!editingWorkout}
              />
            </label>

            <label>
              Termina em:
              <input
                type="date"
                name="duration"
                value={formData.duration}
                onChange={handleForDataChange}
                required
              />
            </label>
          </div>

          <label>
            Nome:
            <input
              type="text"
              name="workoutName"
              value={formData.workoutName}
              onChange={handleForDataChange}
              required
            />
          </label>

          <label>
            Descrição:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleForDataChange}
            />
          </label>

          <label>
            Tipo:
            <select
              name="type"
              value={formData.type}
              onChange={handleForDataChange}
            >
              <option value="">Selecione o tipo</option>
              <option value="A">A</option>
              <option value="AB">AB</option>
              <option value="ABC">ABC</option>
              <option value="ABCD">ABCD</option>
              <option value="ABCDE">ABCDE</option>
              <option value="Outros">Outros</option>
            </select>
          </label>

          <label>
            Foco Muscular:
            <div className={styles.tagsContainer}>
              {formData.muscleFocus.map((muscle) => (
                <span key={muscle} className={styles.tag}>
                  {muscle}
                  <button type="button" onClick={() => removeMuscleGroup(muscle)}>×</button>
                </span>
              ))}
            </div>

            <select
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
            >
              <option value="">Selecione um grupo muscular</option>
              {muscleGroups
                .filter((m) => !formData.muscleFocus.includes(m))
                .map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
            </select>
            <button type="button" onClick={addMuscleFocus} disabled={!selectedMuscle}>
              Adicionar outro
            </button>
          </label>

          <label>
            Criado por:
            <input type="text" value={formData.createdBy} disabled />
          </label>

          {userRole === "profissional" && (
            <label>
              Treino para:
              <select
                name="assignedStudentId"
                value={formData.assignedStudentId}
                onChange={handleForDataChange}
              >
                <option value="">Selecione um aluno</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.fullname || student.email}
                  </option>
                ))}
              </select>
            </label>
          )}

          {userRole === "aluno" && (
            <label>
              Atribuído para:
              <input type="text" value={formData.assignedBy} disabled />
            </label>
          )}

          <div className={styles.confirmBtn}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Confirmar</button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

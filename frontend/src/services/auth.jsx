import { useState } from "react";

export default function useAuthServices() {
  const [authLoading, setAuthLoading] = useState(false);

  const url = 'http://localhost:3000/auth';
  const userUrl = 'http://localhost:3000/users';

  const login = async (formData) => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Tenta extrair mensagens específicas do backend
        const errorText = result?.body?.text?.toLowerCase() || '';

        if (errorText.includes('usuário') || errorText.includes('não encontrado')) {
          throw new Error('usuário não encontrado');
        } else if (errorText.includes('senha')) {
          throw new Error('senha incorreta');
        } else {
          throw new Error(errorText || 'Erro ao fazer login.');
        }
      }

      if (result.success && result.body.token) {
        localStorage.setItem('auth', JSON.stringify({
          token: result.body.token,
          user: result.body.user
        }));
      }

      return result;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (formData) => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.body?.text || 'Erro ao cadastrar.');
      }

      if (result.success && result.body.token) {
        localStorage.setItem('auth', JSON.stringify({
          token: result.body.token,
          user: result.body.user
        }));
      }

      return result;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async ({ email, password }) => {
    try {
      const response = await fetch(`${url}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.body?.text || 'Erro ao redefinir senha.');
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
  };

  const updateUserProfile = async (userId, updatedData) => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${userUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.body?.text || 'Erro ao atualizar o perfil.');
      }

      // Atualiza localStorage
      const currentAuth = JSON.parse(localStorage.getItem('auth'));
      if (currentAuth?.user) {
        localStorage.setItem('auth', JSON.stringify({
          ...currentAuth,
          user: { ...currentAuth.user, ...updatedData }
        }));
      }

      return result;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const getProfessionals = async () => {
    try {
      const response = await fetch(`${userUrl}/professionals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.body?.text || 'Erro ao buscar profissionais.');
      }

      return result.body;
    } catch (error) {
      throw error;
    }
  };

  return {
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    getProfessionals,
    authLoading
  };
}

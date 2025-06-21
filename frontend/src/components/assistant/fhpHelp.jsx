// components/assistant/FHPHelpChat.jsx
import React, { useState, useRef, useEffect } from 'react'
import styles from './assistant.module.css'

export default function FHPHelpChat({ onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatBoxRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userText = input.trim()
    const userMsg = { role: 'user', content: userText }
    const botMsg = { role: 'bot', content: 'Consultando nossos especialistas...' }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: `Você é o FHP Help, um assistente digital especializado em saúde, bem-estar, nutrição esportiva e musculação.
              
Seu papel é responder com clareza, empatia e precisão perguntas relacionadas a:
- Treinamento físico (hipertrofia, emagrecimento, resistência, etc.)
- Nutrição e suplementação
- Exercícios e rotina de academia
- Prevenção de lesões e reabilitação
- Motivação e hábitos saudáveis

🔎 Estilo das respostas:
- Didático, porém direto.
- Se necessário, explique como se estivesse conversando com alguém iniciando na academia.
- Evite linguagem técnica demais, a não ser que o usuário peça.
- Caso a pergunta fuja totalmente do contexto de saúde, bem-estar ou treino, responda educadamente que você é especializado nessa área.`
            },
            {
              role: 'user',
              content: userText
            }
          ],
        }),
      })

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || 'Não consegui encontrar uma resposta agora.'

      setMessages(prev =>
        prev.slice(0, -1).concat({ role: 'bot', content })
      )
    } catch (error) {
      setMessages(prev =>
        prev.slice(0, -1).concat({ role: 'bot', content: 'Erro: ' + error.message })
      )
    }
  }

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={styles.chatPopup}>
      <div className={styles.chatHeader}>
        <h4>FHP Help 💪</h4>
        <button onClick={onClose}>×</button>
      </div>
      <div className={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === 'user' ? 'userMessage' : 'botMessage'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <textarea
          placeholder="Digite sua dúvida sobre treinos ou saúde..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), sendMessage()) : null}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  )
}

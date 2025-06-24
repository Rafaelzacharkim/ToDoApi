// src/app/tarefas/page.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/contexts/AuthContext';
import api from '@/services/api';
import styles from '../../styles/Tarefas.module.css';

// Definimos um tipo para a Tarefa para mais segurança no código
type Tarefa = {
    id: number;
    titulo: string;
    concluida: boolean;
};

export default function TarefasPage() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [titulo, setTitulo] = useState('');
    const { token, logout } = useContext(AuthContext);
    const router = useRouter();

    // Efeito para verificar se o utilizador está autenticado
    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
        } else {
            carregarTarefas();
        }
    }, [token, router]);

    // Função para carregar as tarefas da API
    const carregarTarefas = async () => {
        try {
            const response = await api.get('/tarefas');
            setTarefas(response.data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            // Se o token for inválido (erro 401), faz logout
            if ((error as any).response?.status === 401) {
                logout();
            }
        }
    };

    // Função para criar uma nova tarefa
    const handleCriarTarefa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) return; // Não adiciona se o título estiver vazio

        try {
            const novaTarefa = { titulo, concluida: false };
            await api.post('/tarefas', novaTarefa);
            setTitulo(''); // Limpa o campo de texto
            carregarTarefas(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };
    
    // Função para apagar uma tarefa
    const handleApagarTarefa = async (id: number) => {
        try {
            await api.delete(`/tarefas/${id}`);
            carregarTarefas(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao apagar tarefa:", error);
        }
    };
    
    // Função para marcar/desmarcar uma tarefa como concluída
    const handleToggleTarefa = async (tarefa: Tarefa) => {
        try {
            const tarefaAtualizada = { ...tarefa, concluida: !tarefa.concluida };
            await api.put(`/tarefas/${tarefa.id}`, tarefaAtualizada);
            carregarTarefas(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Minhas Tarefas</h1>
            
            <form onSubmit={handleCriarTarefa} className={styles.form}>
                <input 
                    className={styles.input}
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    placeholder="O que precisa ser feito?" 
                />
                <button type="submit" className={styles.addButton}>Adicionar</button>
            </form>

            <ul className={styles.taskList}>
                {tarefas.map((tarefa) => (
                    <li key={tarefa.id} className={styles.taskItem}>
                        <span className={tarefa.concluida ? styles.taskTitleCompleted : styles.taskTitle}>
                            {tarefa.titulo}
                        </span>
                        <div>
                            <button onClick={() => handleToggleTarefa(tarefa)} className={`${styles.taskButton} ${styles.toggleButton}`}>
                                {tarefa.concluida ? '↩️' : '✔️'}
                            </button>
                            <button onClick={() => handleApagarTarefa(tarefa.id)} className={`${styles.taskButton} ${styles.deleteButton}`}>
                                🗑️
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
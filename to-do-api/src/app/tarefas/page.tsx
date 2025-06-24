// src/app/tarefas/page.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/contexts/AuthContext';
import api from '@/services/api';
import styles from '../../styles/Tarefas.module.css';

type Tarefa = {
    id: number;
    titulo: string;
    concluida: boolean;
};

// Adicionamos um tipo para os dados do utilizador
type UserData = {
    nome: string;
    email: string;
};

export default function TarefasPage() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [titulo, setTitulo] = useState('');
    const [utilizador, setUtilizador] = useState<UserData | null>(null); // Estado para guardar os dados do utilizador
    const { token, logout } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
            return;
        }

        const carregarDados = async () => {
            try {
                // Fazemos duas chamadas em paralelo para otimizar
                const [tarefasResponse, userResponse] = await Promise.all([
                    api.get('/tarefas'),
                    api.get('/auth/me') // Assumindo que temos uma rota '/auth/me' para buscar dados do utilizador
                ]);
                setTarefas(tarefasResponse.data);
                setUtilizador(userResponse.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                if ((error as any).response?.status === 401) {
                    logout();
                }
            }
        };

        carregarDados();
    }, [token, router, logout]);

    const handleCriarTarefa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) return;

        try {
            await api.post('/tarefas', { titulo, concluida: false });
            setTitulo('');
            const response = await api.get('/tarefas'); // Recarrega apenas as tarefas
            setTarefas(response.data);
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
        }
    };
    
    const handleApagarTarefa = async (id: number) => {
        try {
            await api.delete(`/tarefas/${id}`);
            setTarefas(tarefas.filter(t => t.id !== id)); // Otimização: remove do estado sem recarregar
        } catch (error) {
            console.error("Erro ao apagar tarefa:", error);
        }
    };
    
    const handleToggleTarefa = async (tarefa: Tarefa) => {
        try {
            const tarefaAtualizada = { ...tarefa, concluida: !tarefa.concluida };
            await api.put(`/tarefas/${tarefa.id}`, tarefaAtualizada);
            // Otimização: atualiza a tarefa no estado sem recarregar
            setTarefas(tarefas.map(t => t.id === tarefa.id ? tarefaAtualizada : t));
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {utilizador && (
                <div className={styles.welcomeHeader}>
                    <h1>{utilizador.nome}</h1>
                </div>
            )}
            
            <div className={styles.tasksContainer}>
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
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleToggleTarefa(tarefa)} className={`${styles.taskButton} ${styles.toggleButton}`}>
                                    ✓
                                </button>
                                <button onClick={() => handleApagarTarefa(tarefa.id)} className={`${styles.taskButton} ${styles.deleteButton}`}>
                                    🗑
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
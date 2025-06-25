// src/app/tarefas/page.tsx 

'use client'; 

 

import { useEffect, useState, useContext, useCallback } from 'react'; 

import { useRouter } from 'next/navigation'; 

import { AuthContext } from '@/app/contexts/AuthContext'; 

import api from '@/services/api'; 

import styles from '../../styles/Tarefas.module.css'; 

 

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

 

    const [editingTaskId, setEditingTaskId] = useState<number | null>(null); 

    const [editingTaskText, setEditingTaskText] = useState(''); 

 

    const [filter, setFilter] = useState<'todas' | 'ativas' | 'concluidas'>('todas'); 

 

    const carregarTarefas = useCallback(async () => { 

        if (!token) return; 

        try { 

            const response = await api.get('/tarefas'); 

            setTarefas(response.data); 

        } catch (error) { 

            console.error("Erro ao carregar tarefas:", error); 

            if ((error as any).response?.status === 401) { 

                logout(); 

            } 

        } 

    }, [token, logout]); 

 

   useEffect(() => { 

        if (!token) { 

            router.push('/auth/login'); 

        } else { 

            carregarTarefas(); 

        } 

    }, [token, router, carregarTarefas]); 

     

    const handleCriarTarefa = async (e: React.FormEvent) => { 

        e.preventDefault(); 

        if (!titulo.trim()) return; 

        try { 

            await api.post('/tarefas', { titulo, concluida: false }); 

            setTitulo(''); 

            await carregarTarefas(); 

        } catch (error) { 

            console.error("Erro ao criar tarefa:", error); 

        } 

    }; 

     

    const handleApagarTarefa = async (id: number) => { 

        try { 

            await api.delete(`/tarefas/${id}`); 

            setTarefas(tarefas.filter(t => t.id !== id));  

        } catch (error) { 

            console.error("Erro ao apagar tarefa:", error); 

        } 

    }; 

     

    const handleToggleTarefa = async (tarefa: Tarefa) => { 

        try { 

            const tarefaAtualizada = { ...tarefa, concluida: !tarefa.concluida }; 

            await api.put(`/tarefas/${tarefa.id}`, tarefaAtualizada); 

            setTarefas(tarefas.map(t => t.id === tarefa.id ? tarefaAtualizada : t)); 

        } catch (error) { 

            console.error("Erro ao atualizar tarefa:", error); 

        } 

    }; 

 

    const handleEdit = (tarefa: Tarefa) => { 

        setEditingTaskId(tarefa.id); 

        setEditingTaskText(tarefa.titulo); 

    }; 

 

    const handleSave = async (tarefa: Tarefa) => { 

        try { 

            const tarefaAtualizada = { ...tarefa, titulo: editingTaskText }; 

            await api.put(`/tarefas/${tarefa.id}`, tarefaAtualizada); 

            setEditingTaskId(null);  

            carregarTarefas(); 

        } catch (error) { 

            console.error("Erro ao guardar a tarefa:", error); 

        } 

    }; 

 

    const filteredTasks = tarefas.filter(tarefa => { 

        if (filter === 'ativas') return !tarefa.concluida; 

        if (filter === 'concluidas') return tarefa.concluida; 

        return true; // para 'todas' 

    }); 

 

    return ( 

        <div className={styles.container}> 

            <h1 className={styles.title}>Minhas Tarefas</h1> 

             

            <div className={styles.filterGroup}> 

                <button onClick={() => setFilter('todas')} className={filter === 'todas' ? styles.activeFilter : ''}>Todas</button> 

                <button onClick={() => setFilter('ativas')} className={filter === 'ativas' ? styles.activeFilter : ''}>Ativas</button> 

                <button onClick={() => setFilter('concluidas')} className={filter === 'concluidas' ? styles.activeFilter : ''}>Concluídas</button> 

            </div> 

             

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

                {filteredTasks.length > 0 ? filteredTasks.map((tarefa) => ( 

                    <li key={tarefa.id} className={styles.taskItem}> 

                        {editingTaskId === tarefa.id ? ( 

                            <input 

                                type="text" 

                                value={editingTaskText} 

                                onChange={(e) => setEditingTaskText(e.target.value)} 

                                onBlur={() => handleSave(tarefa)} // Guarda ao perder o foco 

                                onKeyDown={(e) => e.key === 'Enter' && handleSave(tarefa)} // Guarda ao pressionar Enter 

                                className={styles.editInput} 

                                autoFocus 

                            /> 

                        ) : ( 

                            <span className={tarefa.concluida ? styles.taskTitleCompleted : styles.taskTitle}> 

                                {tarefa.titulo} 

                            </span> 

                        )} 

                        <div className={styles.buttonGroup}> 

                            {editingTaskId === tarefa.id ? ( 

                                <button onClick={() => handleSave(tarefa)} className={`${styles.taskButton} ${styles.saveButton}`}>💾</button> 

                            ) : ( 

                                <> 

                                    <button onClick={() => handleEdit(tarefa)} className={`${styles.taskButton} ${styles.editButton}`}>✏️</button> 

                                    <button onClick={() => handleToggleTarefa(tarefa)} className={`${styles.taskButton} ${styles.toggleButton}`}>✓</button> 

                                    <button onClick={() => handleApagarTarefa(tarefa.id)} className={`${styles.taskButton} ${styles.deleteButton}`}>🗑️</button> 

                                </> 

                            )} 

                        </div> 

                    </li> 

                )) : ( 

                    <p className={styles.emptyMessage}>Nenhuma tarefa encontrada.</p> 

                )} 

            </ul> 

        </div> 

    ); 

} 
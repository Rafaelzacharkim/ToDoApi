'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Tarefa = {
    id: number;
    titulo: string;
    concluida: boolean;
};

export default function Tarefas() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [titulo, setTitulo] = useState('');
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            carregarTarefas();
        }
    }, []);

    const carregarTarefas = async () => {
        const response = await axios.get('http://localhost:5000/tarefas', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTarefas(response.data);
    };

    const criarTarefa = async () => {
        await axios.post('http://localhost:5000/tarefas', { titulo, concluida: false }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTitulo('');
        carregarTarefas();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Minhas Tarefas</h1>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nova tarefa" />
            <button onClick={criarTarefa}>Adicionar</button>

            <ul>
                {tarefas.map((t) => (
                    <li key={t.id}>{t.titulo} - {t.concluida ? 'Concluída' : 'Pendente'}</li>
                ))}
            </ul>
        </div>
    );
}

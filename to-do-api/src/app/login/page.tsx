'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const router = useRouter();
    const { login } = useContext(AuthContext)!;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        try {
            await login(email, senha);
            router.push('/tarefas');
        } catch (err: any) {
            const mensagemErro = err.response?.data?.title || 'Erro no login';
            setErro(mensagemErro);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
            <button type="submit">Entrar</button>
        </form>
    );
}

// src/app/auth/login/page.tsx
'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/contexts/AuthContext';
import styles from '../../../styles/AuthLayout.module.css';
import Link from 'next/link';

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
            const mensagemErro = err.response?.data?.title || 'Email ou senha inválidos.';
            setErro(mensagemErro);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>Vamos! Entre na conta para ver as suas tarefas!</p>
            
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>E-mail:</label>
                <input 
                    id="email"
                    className={styles.input} 
                    placeholder="O seu e-mail" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
            </div>
            
            <div className={styles.inputGroup}>
                <label htmlFor="senha" className={styles.label}>Senha:</label>
                <input 
                    id="senha"
                    type="password" 
                    className={styles.input} 
                    placeholder="A sua senha" 
                    value={senha} 
                    onChange={e => setSenha(e.target.value)} 
                    required 
                />
            </div>

            {erro && <p className={styles.error}>{erro}</p>}

            <div className={styles.buttonGroup}>
                <Link href="/" className={`${styles.button} ${styles.secondaryButton}`}>
                    Voltar
                </Link>
                <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
                    Entrar
                </button>
            </div>
        </form>
    );
}
// src/app/auth/cadastro/page.tsx
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import styles from '../../../styles/AuthLayout.module.css'; // Usando os mesmos estilos do login
import Link from 'next/link';

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { nome, email, senha });
            router.push("/auth/login"); // Redireciona para a página de login após o sucesso
        } catch (error: any) {
            alert("Erro ao cadastrar: " + (error.response?.data?.title || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h1 className={styles.title}>Cadastro</h1>
            <p className={styles.subtitle}>Crie a sua conta para começar a organizar as tarefas!</p>

            <div className={styles.inputGroup}>
                <label htmlFor="nome" className={styles.label}>Nome:</label>
                <input 
                    id="nome"
                    className={styles.input} 
                    placeholder="O seu nome completo" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>E-mail:</label>
                <input 
                    id="email"
                    type="email"
                    className={styles.input} 
                    placeholder="O seu melhor e-mail" 
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
                    placeholder="Crie uma senha forte" 
                    value={senha} 
                    onChange={e => setSenha(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.buttonGroup}>
                <Link href="/" className={`${styles.button} ${styles.secondaryButton}`}>
                    Voltar
                </Link>
                <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
                    Cadastrar
                </button>
            </div>
        </form>
    );
}
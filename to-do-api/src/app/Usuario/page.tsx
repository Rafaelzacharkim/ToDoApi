// src/app/perfil/page.tsx
    'use client';

    import { useState, useContext, useEffect } from 'react';
    import { AuthContext } from '@/app/contexts/AuthContext';
    import api from '@/services/api';
    import styles from '../../styles/Perfil.module.css';

    export default function PerfilPage() {
        const { user, token } = useContext(AuthContext);

        // Estados para o formulário de nome
        const [nome, setNome] = useState('');
        const [senhaNome, setSenhaNome] = useState('');

        // Estados para o formulário de e-mail
        const [email, setEmail] = useState('');
        const [senhaEmail, setSenhaEmail] = useState('');

        // Estados para feedback
        const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

        useEffect(() => {
            if (user) {
                setNome(user.nome);
                setEmail(user.email);
            }
        }, [user]);

        const showMessage = (text: string, type: 'success' | 'error') => {
            setMessage({ text, type });
            setTimeout(() => setMessage(null), 5000); // A mensagem desaparece após 5 segundos
        };

        const handleUpdateNome = async (e: React.FormEvent) => {
            e.preventDefault();
            setMessage(null);
            if (!senhaNome) {
                showMessage('Por favor, insira a sua senha para confirmar.', 'error');
                return;
            }
            try {
                const response = await api.put('/auth/update', { nome, senhaAtual: senhaNome });
                showMessage(response.data.message, 'success');
                // O ideal aqui seria forçar o AuthContext a recarregar os dados do utilizador
            } catch (error: any) {
                showMessage(error.response?.data?.message || 'Ocorreu um erro.', 'error');
            } finally {
                setSenhaNome('');
            }
        };

        const handleUpdateEmail = async (e: React.FormEvent) => {
            e.preventDefault();
            setMessage(null);
            if (!senhaEmail) {
                showMessage('Por favor, insira a sua senha para confirmar.', 'error');
                return;
            }
            try {
                const response = await api.put('/auth/update', { email, senhaAtual: senhaEmail });
                showMessage(response.data.message, 'success');
            } catch (error: any) {
                showMessage(error.response?.data?.message || 'Ocorreu um erro.', 'error');
            } finally {
                setSenhaEmail('');
            }
        };

        if (!token || !user) {
            return <p>A carregar...</p>; // Ou um redirecionamento
        }

        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Meu Perfil</h1>
                
                {message && (
                    <div className={${styles.message} ${message.type === 'success' ? styles.success : styles.error}}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdateNome} className={styles.form}>
                    <h2>Alterar Nome</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="nome" className={styles.label}>Nome</label>
                        <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="senhaNome" className={styles.label}>Senha Atual para Confirmar</label>
                        <input id="senhaNome" type="password" value={senhaNome} onChange={(e) => setSenhaNome(e.target.value)} className={styles.input} placeholder="" />
                    </div>
                    <button type="submit" className={styles.button}>Guardar Nome</button>
                </form>

                <form onSubmit={handleUpdateEmail} className={styles.form}>
                    <h2>Alterar E-mail</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>E-mail</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="senhaEmail" className={styles.label}>Senha Atual para Confirmar</label>
                        <input id="senhaEmail" type="password" value={senhaEmail} onChange={(e) => setSenhaEmail(e.target.value)} className={styles.input} placeholder="" />
                    </div>
                    <button type="submit" className={styles.button}>Guardar E-mail</button>
                </form>
            </div>
        );
    }
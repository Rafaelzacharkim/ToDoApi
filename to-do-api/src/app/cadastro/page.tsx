'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api"; // 👈 importa aqui

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", { nome, email, senha });

            router.push("/login");
        } catch (error: any) {
            alert("Erro ao cadastrar: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Cadastro</h1>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" required />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

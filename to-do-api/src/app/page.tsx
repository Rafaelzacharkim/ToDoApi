// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Bem-vindo ao ToDo App</h1>
      <p>Escolha uma opção abaixo:</p>
      <ul>
        <li><Link href="/login">Entrar</Link></li>
        <li><Link href="/cadastro">Cadastrar</Link></li>
        <li><Link href="/tarefas">Minhas Tarefas</Link></li>
      </ul>
    </main>
  );
}

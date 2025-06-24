// src/app/page.tsx

import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1>Bem-vindo à ToDo API</h1>
          <p>A sua solução simples e eficaz para gerir tarefas.</p>
        </section>
        
        <section className={styles.ctas}>
          <Link href="/auth/login" className={`${styles.button} ${styles.primary}`}>
            Entrar
          </Link>
          <Link href="/auth/cadastro" className={`${styles.button} ${styles.secondary}`}>
            Cadastrar
          </Link>
        </section>

        <div className={styles.tasksLink}>
          <Link href="/tarefas">
            Ver as minhas tarefas
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} ToDo API. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

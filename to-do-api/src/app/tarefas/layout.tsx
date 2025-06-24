// src/app/tarefas/layout.tsx
import Header from "../../components/Header/headers";
import Footer from "../../components/Footer/footer";
import styles from '../../styles/AuthLayout.module.css'; // Podemos reutilizar este estilo

export default function TarefasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
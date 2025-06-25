import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from '../../styles/AuthLayout.module.css'; // Podemos reutilizar

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
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
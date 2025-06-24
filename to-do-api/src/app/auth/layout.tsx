// src/app/(auth)/layout.tsx
import Header from "../../components/Header/headers";
import Footer from "../../components/Footer/footer";
import styles from '../../styles/AuthLayout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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
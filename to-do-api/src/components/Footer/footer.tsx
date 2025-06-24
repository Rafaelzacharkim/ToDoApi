// src/components/Footer.tsx
import styles from '../../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} ToDo API. Todos os direitos reservados.</p>
    </footer>
  );
}
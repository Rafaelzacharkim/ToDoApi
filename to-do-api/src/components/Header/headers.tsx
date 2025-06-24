// src/components/Header.tsx
import Link from 'next/link';
import styles from '../../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <h1 className={styles.logo}>ToDo API</h1>
        </Link>
      </div>
    </header>
  );
}
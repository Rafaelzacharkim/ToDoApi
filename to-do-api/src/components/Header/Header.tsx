// src/components/Header/Header.tsx 

'use client'; 

 

import { useContext } from 'react'; 

import Link from 'next/link'; 

import { useRouter } from 'next/navigation'; 

import { AuthContext } from '@/app/contexts/AuthContext'; 

import styles from '../../styles/Header.module.css'; 

 

export default function Header() { 

  const { user, logout } = useContext(AuthContext); 

  const router = useRouter(); 

 

  const handleLogout = () => { 

    logout(); 

    router.push('/auth/login'); 

  }; 

 

  return ( 

    <header className={styles.header}> 

      <div className={styles.container}> 

        <Link href="/"> 

          <h1 className={styles.logo}>ToDo API</h1> 

        </Link> 

        {user && ( 

          <div className={styles.userSection}> 

            <span className={styles.userName}>{user.nome}</span> 

            <button onClick={handleLogout} className={styles.logoutButton}>Sair</button> 

          </div> 

        )} 

      </div> 

    </header> 

  ); 

} 
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/LogoHome-AvaliAccess.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a className={styles.brand} href="/">
          <img src={logo} alt="AvaliAccess Logo" className={styles.logo} />
        </a>
        
        <button 
          className={styles.toggler} 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Alternar navegação"
        >
          <span className={styles.hamburger}></span>
        </button>
        
        <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a className={styles.navLink} href="/">Home</a>
            </li>
            <li className={styles.navItem}>
              <a className={styles.navLink} href="/explore">Explorar</a>
            </li>
            <li className={styles.navItem}>
              <a className={styles.navLink} href="/register-place">Cadastrar Local</a>
            </li>
            <li className={`${styles.navItem} ${styles.authButtons}`}>
              <button className={styles.loginButton} onClick={() => window.location.href = '/login'}>Login</button>
              <button className={styles.ctaButton} onClick={() => window.location.href = '/login'}>Cadastre-se</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
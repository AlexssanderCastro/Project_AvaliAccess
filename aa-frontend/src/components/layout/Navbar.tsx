import React, { useState } from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/LogoHome-AvaliAccess.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link className={styles.brand} to="/">
          <img src={logo} alt="AvaliAccess Logo" className={styles.logo} />
        </Link>
        
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
              <Link className={styles.navLink} to="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/explore">Explorar</Link>
            </li>
            {token && (
              <li className={styles.navItem}>
                <Link className={styles.navLink} to="/register-establishment">Cadastrar Local</Link>
              </li>
            )}
            <li className={`${styles.navItem} ${styles.authButtons}`}>
              {token ? (
                <>
                  <span className={styles.userName}>Olá, {user?.name}</span>
                  <button onClick={handleLogout} className={styles.loginButton}>Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.loginButton}>Login</Link>
                  <Link to="/register" className={styles.ctaButton}>Cadastre-se</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
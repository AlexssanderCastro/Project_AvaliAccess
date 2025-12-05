import React, { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/LogoHome-AvaliAccess.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLLIElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // close admin submenu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
              <Link className={styles.navLink} to="/">
                <i className="bi bi-house-fill" />
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link className={styles.navLink} to="/explore">
                <i className="bi bi-search" />
                Explorar
              </Link>
            </li>
            {token && (
              <li className={styles.navItem}>
                <Link className={styles.navLink} to="/register-establishment">
                  <i className="bi bi-building" />
                  Cadastrar Local
                </Link>
              </li>
            )}
            {token && user?.roles?.includes('ADMINISTRADOR') && (
              <li
                className={`${styles.navItem} ${styles.adminDropdown} ${adminOpen ? styles.open : ''}`}
                ref={adminRef}
              >
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setAdminOpen(!adminOpen)}
                  aria-haspopup="true"
                  aria-expanded={adminOpen}
                >
                  <i className="bi bi-gear-fill" /> Administração
                  <i className={`bi ${adminOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'} ${styles.caret}`} />
                </button>
                <ul className={styles.dropdownMenu} role="menu">
                  <li>
                    <Link className={styles.dropdownItem} to="/admin/reports"><i className="bi bi-shield-exclamation me-2"/>Denúncias</Link>
                  </li>
                  <li>
                    <Link className={styles.dropdownItem} to="/admin/sponsored"><i className="bi bi-star-fill me-2"/>Patrocínios</Link>
                  </li>
                  <li>
                    <Link className={styles.dropdownItem} to="/admin/users"><i className="bi bi-people-fill me-2"/>Usuários</Link>
                  </li>
                </ul>
              </li>
            )}
            <li className={`${styles.navItem} ${styles.authButtons}`}>
              {token ? (
                <>
                  <Link to="/profile" className={styles.profileLink}>
                    <i className="bi bi-person-circle" /> {user?.name}
                  </Link>
                  <button onClick={handleLogout} className={styles.loginButton}>Sair</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.loginButton}><i className="bi bi-box-arrow-in-right me-1"/>Login</Link>
                  <Link to="/register" className={styles.ctaButton}><i className="bi bi-person-plus me-1"/>Cadastre-se</Link>
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
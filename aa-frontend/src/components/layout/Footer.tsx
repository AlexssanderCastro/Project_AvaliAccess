import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2025 AvaliAccess. Todos os direitos reservados.</p>
        <div className={styles.footerLinks}>
          <a href="#privacy">Política de Privacidade</a>
          <a href="#terms">Termos de Uso</a>
          <a href="#contact">Contato</a>
        </div>
        <p>Construindo um mundo mais acessível para todos.</p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import LoginForm from '../../components/auth/login/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <main className={styles.mainContent}>
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;

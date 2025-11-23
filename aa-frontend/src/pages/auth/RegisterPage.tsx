
import React from 'react';
import RegisterForm from '../../components/auth/register/RegisterForm';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.registerPage}>
      <main className={styles.mainContent}>
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;

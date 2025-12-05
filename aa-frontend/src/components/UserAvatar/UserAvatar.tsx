import React from 'react';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
  photoUrl?: string | null;
  userName: string;
  size?: 'small' | 'medium' | 'large';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ photoUrl, userName, size = 'medium' }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';
  
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const fullPhotoUrl = photoUrl ? `${API_URL}${photoUrl}` : null;
  
  console.log('UserAvatar - photoUrl:', photoUrl);
  console.log('UserAvatar - fullPhotoUrl:', fullPhotoUrl);

  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {fullPhotoUrl ? (
        <img 
          src={fullPhotoUrl} 
          alt={userName}
          className={styles.avatarImage}
          onError={(e) => {
            console.error('Erro ao carregar imagem:', fullPhotoUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className={styles.avatarInitials}>
          {getInitials(userName)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

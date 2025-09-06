import React from 'react';
import styles from './EstablishmentCard.module.css';

interface EstablishmentCardProps {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  type: string;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ 
  name, 
  rating, 
  reviews, 
  address, 
  type 
}) => {
  // Generate a random image URL for the placeholder
  const imageUrl = `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/200`;

  return (
    <div className={styles.establishmentCard}>
      <div
        className={styles.imagePlaceholder}
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className={styles.cardHeader}>
        <h3>{name}</h3>
        <span className={styles.establishmentType}>{type}</span>
      </div>

      <div className={styles.rating}>
        <div className={styles.stars}>
          {'★'.repeat(Math.floor(rating))}
          {'☆'.repeat(5 - Math.floor(rating))}
        </div>
        <span className={styles.ratingText}>({rating})</span>
      </div>

      <p className={styles.address}>{address}</p>

      <div className={styles.cardFooter}>
        <span className={styles.reviews}>{reviews} avaliações</span>
        <button className={styles.viewButton}>Ver detalhes</button>
      </div>
    </div>
  );
};

export default EstablishmentCard;

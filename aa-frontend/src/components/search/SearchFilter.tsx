import React, { useState } from 'react';
import styles from './SearchFilter.module.css';
import {
  ESTABLISHMENT_TYPES,
  ACCESSIBILITY_RATINGS,
  STATES,
  CITIES_BY_STATE,
} from '../../constants';

const SearchFilter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [establishmentType, setEstablishmentType] = useState('');
  const [accessibilityRating, setAccessibilityRating] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de busca a ser implementada
    console.log({
      searchTerm,
      establishmentType,
      accessibilityRating,
      state,
      city,
    });
  };

  const availableCities = state ? CITIES_BY_STATE[state] || [] : [];

  return (
    <form className={styles.searchContainer} onSubmit={handleSearch}>
      {/* Filtros acima da barra de pesquisa */}
      <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={establishmentType}
          onChange={(e) => setEstablishmentType(e.target.value)}
        >
          <option value="">Tipo de Estabelecimento</option>
          {ESTABLISHMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        <select
          className={styles.filterSelect}
          value={accessibilityRating}
          onChange={(e) => setAccessibilityRating(e.target.value)}
        >
          <option value="">Nota de Acessibilidade</option>
          {ACCESSIBILITY_RATINGS.map((rating) => (
            <option key={rating.value} value={rating.value}>
              {rating.label}
            </option>
          ))}
        </select>
        
        <select
          className={styles.filterSelect}
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity(''); // Reset city when state changes
          }}
        >
          <option value="">Estado</option>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        
        <select
          className={styles.filterSelect}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state || availableCities.length === 0}
        >
          <option value="">Cidade</option>
          {availableCities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Barra de pesquisa MAIOR */}
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Digite o nome de um estabelecimento, endereço ou tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchButton} type="submit">
          <span className={styles.searchIcon}>🔍</span>
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchFilter;

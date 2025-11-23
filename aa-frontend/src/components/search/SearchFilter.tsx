import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchFilter.module.css';
import {
  ESTABLISHMENT_TYPES,
  ACCESSIBILITY_RATINGS,
  STATES,
} from '../../constants';
import { EstablishmentAPI, EstablishmentResponse } from '../../services/establishmentApi';

const SearchFilter: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [establishmentType, setEstablishmentType] = useState('');
  const [accessibilityRating, setAccessibilityRating] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<EstablishmentResponse[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchEstablishments = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const searchParams: any = {
          name: searchTerm,
          page: 0,
          size: 10,
        };
        
        // Adicionar filtros ativos à busca de sugestões somente se tiverem valor
        if (city && city.trim()) searchParams.city = city;
        if (state && state.trim()) searchParams.state = state;
        if (establishmentType && establishmentType.trim()) searchParams.type = establishmentType;
        if (accessibilityRating && accessibilityRating.trim()) searchParams.minRating = accessibilityRating;
        
        const response = await EstablishmentAPI.search(searchParams);
        setSuggestions(response.content);
        setShowDropdown(response.content.length > 0);
      } catch (error) {
        console.error('Erro ao buscar estabelecimentos:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchEstablishments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, city, state, establishmentType, accessibilityRating]);

  const handleSelectEstablishment = (id: number) => {
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
    navigate(`/establishment/${id}`);
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    setCity(''); // Limpar cidade quando estado muda
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm && searchTerm.trim()) params.append('name', searchTerm);
    if (city && city.trim()) params.append('city', city);
    if (state && state.trim()) params.append('state', state);
    if (establishmentType && establishmentType.trim()) params.append('type', establishmentType);
    if (accessibilityRating && accessibilityRating.trim()) params.append('minRating', accessibilityRating);
    
    navigate(`/explore${params.toString() ? '?' + params.toString() : ''}`);
    setShowDropdown(false);
  };

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
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="">Estado</option>
          {STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          className={styles.filterSelect}
          placeholder="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      
      {/* Barra de pesquisa MAIOR com dropdown */}
      <div className={styles.searchBar} ref={dropdownRef}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Digite o nome de um estabelecimento, endereço ou tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && (
          <div className={styles.loadingSpinner}>
            <div className="spinner-border spinner-border-sm text-success" />
          </div>
        )}
        <button className={styles.searchButton} type="submit">
          <span className={styles.searchIcon}>🔍</span>
          Buscar
        </button>

        {/* Dropdown de sugestões */}
        {showDropdown && suggestions.length > 0 && (
          <div className={styles.dropdown}>
            {suggestions.map((establishment) => {
              const photoUrl = establishment.photoUrl
                ? `${API_URL}${establishment.photoUrl}`
                : null;

              return (
                <div
                  key={establishment.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectEstablishment(establishment.id)}
                >
                  <div className={styles.establishmentPhoto}>
                    {photoUrl ? (
                      <img src={photoUrl} alt={establishment.name} />
                    ) : (
                      <div className={styles.noPhoto}>
                        <span>🏢</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.establishmentInfo}>
                    <div className={styles.establishmentName}>{establishment.name}</div>
                    <div className={styles.establishmentDetails}>
                      📍 {establishment.city}, {establishment.state}
                      <span className={styles.rating}>
                        ⭐ {establishment.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchFilter;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilter from '../components/search/SearchFilter';
import fundoPesquisa from '../assets/images/fundo-pesquisa.jpg';
import styles from './HomePage.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { EstablishmentAPI, EstablishmentResponse } from '../services/establishmentApi';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [topEstablishments, setTopEstablishments] = useState<EstablishmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

  useEffect(() => {
    loadTopEstablishments();
  }, []);

  const loadTopEstablishments = async () => {
    setLoading(true);
    try {
      const response = await EstablishmentAPI.search({
        page: 0,
        size: 9,
        sortBy: 'averageRating',
        sortDirection: 'desc',
      });
      setTopEstablishments(response.content);
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 4000,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4000,
        }
      }
    ]
  };

  return (
    <>
      {/* Hero Section com imagem de fundo */}
      <section className={styles.heroSection} style={{ backgroundImage: `url(${fundoPesquisa})` }}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1>
                <span style={{ color: '#49ca81ff', fontWeight: '700' }}>Bem-vindo ao AvaliAccess </span>
            </h1>
            <p>Encontre e avalie a acessibilidade de estabelecimentos. Ajude a construir um mundo mais inclusivo.</p>

            {/* Filtros posicionados acima da barra de pesquisa */}
            <div className={styles.filtersContainer}>
              <SearchFilter />
            </div>
          </div>
        </div>
      </section>

      {/* Estabelecimentos Mais Bem Avaliados */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2>Estabelecimentos Mais Bem Avaliados</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : topEstablishments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Nenhum estabelecimento encontrado.</p>
            </div>
          ) : (
            <Slider {...settings}>
              {topEstablishments.map((establishment) => {
                const photoUrl = establishment.photoUrl
                  ? `${API_URL}${establishment.photoUrl}`
                  : null;

                return (
                  <div key={establishment.id} style={{ padding: '0 10px' }}>
                    <div
                      className={styles.establishmentCard}
                      onClick={() => navigate(`/establishment/${establishment.id}`)}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={establishment.name}
                          className={styles.cardImage}
                        />
                      ) : (
                        <div className={styles.noImage}>
                          <span>🏢</span>
                        </div>
                      )}
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>{establishment.name}</h3>
                        <p className={styles.cardAddress}>
                          📍 {establishment.city}, {establishment.state}
                        </p>
                        <div className={styles.cardType}>{establishment.type}</div>
                        <div className={styles.cardRating}>
                          ⭐ {establishment.averageRating.toFixed(1)} ({establishment.totalRatings} {establishment.totalRatings === 1 ? 'avaliação' : 'avaliações'})
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;

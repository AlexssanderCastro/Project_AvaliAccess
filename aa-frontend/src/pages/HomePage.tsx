import React from 'react';
import Navbar from '../components/layout/Navbar';
import SearchFilter from '../components/search/SearchFilter';
import EstablishmentCard from '../components/EstablishmentCard/EstablishmentCard';
import fundoPesquisa from '../assets/images/fundo-pesquisa.jpg';
import styles from './HomePage.module.css';
import Slider from 'react-slick'; // Import Slider
import 'slick-carousel/slick/slick.css'; // Import slick-carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick-carousel theme CSS

const HomePage: React.FC = () => {
  const featuredEstablishments = [
    {
      id: 1,
      name: "Shopping Center Norte",
      rating: 4.5,
      reviews: 128,
      address: "Av. Cruzeiro do Sul, 1.890 - Santana, São Paulo - SP",
      type: "Shopping"
    },
    {
      id: 2,
      name: "Restaurante Sabor Paulista",
      rating: 4.2,
      reviews: 76,
      address: "R. Augusta, 512 - Consolação, São Paulo - SP",
      type: "Restaurante"
    },
    {
      id: 3,
      name: "Cinema Art",
      rating: 4.7,
      reviews: 95,
      address: "R. Frei Caneca, 569 - Consolação, São Paulo - SP",
      type: "Cinema"
    },
    {
      id: 4,
      name: "Parque Ibirapuera",
      rating: 4.8,
      reviews: 250,
      address: "Av. Pedro Álvares Cabral, s/n - Vila Mariana, São Paulo - SP",
      type: "Parque"
    },
    {
      id: 5,
      name: "Museu do Futebol",
      rating: 4.6,
      reviews: 180,
      address: "Praça Charles Miller, s/n - Pacaembu, São Paulo - SP",
      type: "Museu"
    },
    {
      id: 6,
      name: "Teatro Municipal",
      rating: 4.9,
      reviews: 150,
      address: "Praça Ramos de Azevedo, s/n - Centro, São Paulo - SP",
      type: "Teatro"
    },
    {
      id: 7,
      name: "Mercado Municipal",
      rating: 4.3,
      reviews: 200,
      address: "Rua da Cantareira, 306 - Centro, São Paulo - SP",
      type: "Mercado"
    },
    {
      id: 8,
      name: "Aquário de São Paulo",
      rating: 4.4,
      reviews: 110,
      address: "Rua Dr. Gentil de Moura, 410 - Ipiranga, São Paulo - SP",
      type: "Aquário"
    },
    {
      id: 9,
      name: "Pinacoteca do Estado",
      rating: 4.7,
      reviews: 90,
      address: "Praça da Luz, 2 - Luz, São Paulo - SP",
      type: "Museu"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />

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

      {/* Estabelecimentos em Destaque */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2>Estabelecimentos em destaque</h2>

          <Slider {...settings}>
            {featuredEstablishments.map(establishment => (
              <EstablishmentCard key={establishment.id} {...establishment} />
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
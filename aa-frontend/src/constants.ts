export const ESTABLISHMENT_TYPES = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'loja', label: 'Loja' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cinema', label: 'Cinema' },
  { value: 'parque', label: 'Parque' },
];

export const ACCESSIBILITY_RATINGS = [
  { value: '1', label: '1 estrela ou mais' },
  { value: '2', label: '2 estrelas ou mais' },
  { value: '3', label: '3 estrelas ou mais' },
  { value: '4', label: '4 estrelas ou mais' },
  { value: '5', label: '5 estrelas' },
];

export const STATES = [
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
];

export const CITIES_BY_STATE: { [key: string]: { value: string; label: string }[] } = {
  SP: [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'campinas', label: 'Campinas' },
  ],
  RJ: [
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
  ],
  MG: [
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
  ],
};

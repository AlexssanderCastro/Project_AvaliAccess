export interface ReviewData {
  rating: number;
  comment: string;
  hasRamp: boolean;
  hasAccessibleRestroom: boolean;
  hasAccessibleParking: boolean;
  hasElevator: boolean;
  hasAccessibleEntrance: boolean;
  hasTactileFloor: boolean;
  hasSignLanguageService: boolean;
  hasAccessibleSeating: boolean;
}

export interface ReviewResponse {
  id: number;
  establishmentId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  hasRamp: boolean;
  hasAccessibleRestroom: boolean;
  hasAccessibleParking: boolean;
  hasElevator: boolean;
  hasAccessibleEntrance: boolean;
  hasTactileFloor: boolean;
  hasSignLanguageService: boolean;
  hasAccessibleSeating: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccessibilityFeatures {
  hasRamp: boolean;
  hasAccessibleRestroom: boolean;
  hasAccessibleParking: boolean;
  hasElevator: boolean;
  hasAccessibleEntrance: boolean;
  hasTactileFloor: boolean;
  hasSignLanguageService: boolean;
  hasAccessibleSeating: boolean;
}

export interface AccessibilityFeatureInfo {
  key: keyof AccessibilityFeatures;
  label: string;
  icon: string;
}

export const ACCESSIBILITY_FEATURES: AccessibilityFeatureInfo[] = [
  { key: 'hasRamp', label: 'Rampa de Acesso', icon: 'bi-arrow-up-circle' },
  { key: 'hasAccessibleRestroom', label: 'Banheiro Adaptado', icon: 'bi-door-open' },
  { key: 'hasAccessibleParking', label: 'Estacionamento com Vaga para Deficiente', icon: 'bi-p-square' },
  { key: 'hasElevator', label: 'Elevador', icon: 'bi-box-arrow-up' },
  { key: 'hasAccessibleEntrance', label: 'Entrada Acessível', icon: 'bi-door-closed' },
  { key: 'hasTactileFloor', label: 'Piso Tátil', icon: 'bi-grid-3x3' },
  { key: 'hasSignLanguageService', label: 'Atendimento em Libras', icon: 'bi-hand-index-thumb' },
  { key: 'hasAccessibleSeating', label: 'Assentos Adaptados', icon: 'bi-chair' },
];

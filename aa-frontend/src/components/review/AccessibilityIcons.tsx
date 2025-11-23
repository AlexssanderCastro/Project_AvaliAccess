import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AccessibilityFeatures, ACCESSIBILITY_FEATURES } from '../../types/review';
import styles from './AccessibilityIcons.module.css';

interface AccessibilityIconsProps {
  features: AccessibilityFeatures;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

const AccessibilityIcons: React.FC<AccessibilityIconsProps> = ({
  features,
  size = 'medium',
  showLabels = false,
}) => {
  const activeFeatures = ACCESSIBILITY_FEATURES.filter(
    (feature) => features[feature.key]
  );

  if (activeFeatures.length === 0) {
    return (
      <span className={styles.noFeatures}>
        Nenhuma característica de acessibilidade informada
      </span>
    );
  }

  return (
    <div className={`${styles.iconsContainer} ${styles[size]}`}>
      {activeFeatures.map((feature) => {
        const icon = (
          <div className={styles.iconWrapper}>
            <i className={`bi ${feature.icon} ${styles.icon}`} />
            {showLabels && (
              <span className={styles.label}>{feature.label}</span>
            )}
          </div>
        );

        return (
          <OverlayTrigger
            key={feature.key}
            placement="top"
            overlay={<Tooltip id={`tooltip-${feature.key}`}>{feature.label}</Tooltip>}
          >
            {icon}
          </OverlayTrigger>
        );
      })}
    </div>
  );
};

export default AccessibilityIcons;

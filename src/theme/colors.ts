// Colors - Paleta de colores única
export const colors = {
  // Brand Colors - Púrpura + Turquesa
  primary: '#6C5CE7',        // Púrpura vibrante (acento principal)
  primaryDark: '#5443C7',    // Púrpura oscuro (pressed state)
  primaryLight: '#A29BFE',   // Púrpura claro (backgrounds)
  
  // Secondary Colors - Turquesa diferenciador
  secondary: '#00D2D3',      // Turquesa (acciones secundarias)
  secondaryDark: '#00A8A9',  
  secondaryLight: '#81E6E6', 
  
  // Neutrals (Light Theme)
  background: '#FFFFFF',     // Fondo principal
  surface: '#F8F9FA',        // Cards, inputs
  surfaceAlt: '#E9ECEF',     // Separadores
  
  // Text
  textPrimary: '#212529',    // Texto principal
  textSecondary: '#6C757D',  // Texto secundario
  textTertiary: '#ADB5BD',   // Placeholders, disabled
  
  // Semantic Colors
  success: '#00B894',        // Verde
  error: '#D63031',          // Rojo
  warning: '#FDCB6E',        // Amarillo
  info: '#74B9FF',           // Azul
  
  // Interactive
  link: '#6C5CE7',           // Link color
  like: '#FD79A8',           // Rosa para likes (diferente!)
  bookmark: '#FDCB6E',       // Amarillo para bookmarks
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.3)',
  
  // Borders
  border: '#DEE2E6',
  borderDark: '#CED4DA',
};

// Dark Theme (para futuro)
export const darkColors = {
  // Reutilizar colors de light
  ...colors,
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2D2D2D',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#707070',
  border: '#2D2D2D',
  borderDark: '#3D3D3D',
};

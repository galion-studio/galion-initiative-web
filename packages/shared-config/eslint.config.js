/**
 * Shared ESLint Configuration
 * 
 * Common linting rules for all Project 42 applications
 */

export default {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Enforce consistent code style
    'prefer-const': 'error',
    'no-var': 'error',
    
    // React best practices
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    
    // TypeScript best practices
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    
    // General code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};

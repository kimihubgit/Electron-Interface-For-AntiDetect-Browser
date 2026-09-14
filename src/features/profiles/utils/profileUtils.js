import React from 'react';
import CountryFlag from '../../../components/common/CountryFlag';

// Helper for Country Flags: renders high-quality SVG flag from assets/flags
export const getCountryFlag = (code, width = 18, height = 12) => {
  return React.createElement(CountryFlag, {
    code,
    width,
    height,
    style: { marginRight: '5px' }
  });
};

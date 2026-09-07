import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/titlebar.css';
import App from './App.jsx';
import { I18nProvider } from './i18n/I18nContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);

// Fade out and remove splash screen after React has rendered
const splash = document.getElementById('splash');
if (splash) {
  splash.classList.add('hide');
  setTimeout(() => splash.remove(), 350);
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/titlebar.css';
import App from './App.jsx';
import MiniDock from './components/dock/MiniDock.jsx';
import { I18nProvider } from './i18n/I18nContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { initAppearanceSettings } from './utils/themeManager.js';

// Check if this window was opened as the Mini Floating Dock
const isMiniDock = window.location.hash === '#mini-dock' || window.location.search.includes('view=mini-dock');

if (isMiniDock) {
  const splash = document.getElementById('splash');
  if (splash) splash.remove();

  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <MiniDock />
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  // Apply saved theme, accent color, and font size before rendering
  initAppearanceSettings();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <I18nProvider>
          <App />
        </I18nProvider>
      </ErrorBoundary>
    </StrictMode>,
  );

  // Fade out and remove splash screen after React has rendered
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 350);
  }
}

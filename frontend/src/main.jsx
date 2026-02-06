//region Imports
// * React DOM client for rendering the application into the root element
import ReactDOM from 'react-dom/client';

// * Main entry point component of the application
import App from './App.jsx';
// * Wrapper component for global context providers and configurations
import { AppProviders } from './app/providers/AppProviders.jsx';

// * Bootstrap CSS framework for responsive styling
import 'bootstrap/dist/css/bootstrap.min.css';
// * Custom global stylesheet for application-wide overrides
import './styles/global.css';
//endregion Imports

//region Render
ReactDOM?.createRoot(document?.getElementById('root'))?.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
//endregion Render

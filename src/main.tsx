import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import 'antd/dist/reset.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.css';

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

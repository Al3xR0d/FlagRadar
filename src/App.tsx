import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AppRouter } from './router';

const App: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <AppRouter />
    </Layout>
  </BrowserRouter>
);

export default App;

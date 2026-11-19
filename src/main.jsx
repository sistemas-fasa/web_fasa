import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Site from './App.jsx';

const root = document.getElementById('root');
const page = <Site path={window.location.pathname} />;
if (root.hasChildNodes()) {
  hydrateRoot(root, page);
} else {
  createRoot(root).render(page);
}

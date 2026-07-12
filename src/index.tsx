import { createRoot } from 'react-dom/client';
import App from './App';

const rootNode = document.getElementById('root');
if (rootNode === null) {
  throw new Error('root not found')
}

const root = createRoot(rootNode);
root.render(<App />);
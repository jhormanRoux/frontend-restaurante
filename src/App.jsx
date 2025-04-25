import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cliente from './pages/Cliente';
import Admin from './pages/Admin';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Cliente />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    
  );
}

export default App;

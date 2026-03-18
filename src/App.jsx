import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Home from './pages/Home';
import Groups from "./pages/Groups";
import './App.css';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/groups" element={<Groups />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
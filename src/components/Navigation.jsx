import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="nav">
      <Link to="/" className="logo">SafeBoard Круиз</Link>
      <div className="nav-links">
        <Link to="/">Главная</Link>
        <Link to="/users">Состав круиза</Link>
        <Link to="/groups">Команда</Link>
      </div>
    </nav>
  );
}
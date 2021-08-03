import { Link } from "react-router-dom";

const NavbarHome = () => {
    return (
        <nav className="navbar navbar-home">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            <ul>
                <li><Link to="/profiles" className="nav-btn">Developers</Link></li>
                <li><Link to="/register" className="nav-btn">Register</Link></li>
                <li><Link to="/login" className="nav-btn">Login</Link></li>
            </ul>
        </nav>

    );
}

export default NavbarHome;
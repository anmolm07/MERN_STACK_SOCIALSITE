import { Link } from "react-router-dom";
import { Fragment } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li>
                <Link to="/posts" className="nav-btn">
                    Posts
                </Link>
            </li>
            <li>
                <Link to="/profiles" className="nav-btn">
                    Developers
                </Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user" />{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <a onClick={logout} href="#!">
                    <i className="fas fa-sign-out-alt" />{' '}
                    <span className="hide-sm">Logout</span>
                </a>
            </li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li><Link to="/profiles" className="nav-btn">Developers</Link></li>
            <li><Link to="/register" className="nav-btn">Register</Link></li>
            <li><Link to="/login" className="nav-btn">Login</Link></li>
        </ul>
    )
    return (
        <nav className="navbar">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            {!loading && (<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        </nav>

    );
}

Navbar.propType = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);
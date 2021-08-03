import bubble from '../../images/bubble.png';
import { Link ,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from'prop-types';

const Landing = ({isAuthenticated}) => {
    if(isAuthenticated){
        return <Redirect to='/dashboard'/>
    }

    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Developer Connector</h1>
                    <p className="lead">
                        Create a developer profile/portfolio, share posts and get help from
                        other developers
                    </p>
                    <div className="buttons">
                        <Link to="/register" id="center-btn" className="btn btn-mid">Sign Up</Link>
                        <Link to="/login" id="center-btn" className="btn btn-mid">Login</Link>
                    </div>
                </div>
            </div>
            <div className="bubbles">
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
                <img src={bubble} alt="bubble"/>
            </div>
        </section>
    );
}

Landing.propTypes={
    isAuthenticated:PropTypes.bool
}

const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated
})


export default connect(mapStateToProps)(Landing);
import { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';


const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-second">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user" /> Welcome {user && user.name.toUpperCase()}
        </p>
        {profile !== null ? (
            <Fragment>
                <DashboardActions />
                <br />
                <Experience experience={profile.experience} />
                <br />
                <Education education={profile.education} />
                <br/>
                <div className="my-2">
                    <button className="btn btn-danger" onClick={() => deleteAccount()}>
                        <i className="fas fa-user-minus" /> Delete My Account
                    </button>
                </div>
            </Fragment>) : (<Fragment>
                <p>You have not yet setup a profile, please add some info</p>
                <Link to="/create-profile" className="btn btn-second my-1">
                    Create Profile
                </Link>
            </Fragment>)}
    </Fragment>
};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})



export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getProfiles } from '../../actions/profile';
import Profileitem from './Profileitem';


const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => {
        getProfiles()
    }, [getProfiles]);

    const [filterprofile, setFilterProfile] = useState('');

    return (
        <Fragment>
            {loading ? <Spinner /> : (<Fragment>
                <h1 className='large text-second'>Developers</h1>
                <p className='lead'>
                    <i className='fab fa-connectdevelop' /> Browse and connect with
                    developers
                </p>
                <div className="cardbg-light">
                    <div className="form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Search"
                                name="Search"
                                value={filterprofile}
                                onChange={e => setFilterProfile(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className='profiles'>
                    {profiles.length > 0 ? (
                        profiles.map(profile => profile.user.name.toUpperCase().includes(filterprofile.toUpperCase()) && (
                            <Profileitem key={profile._id} profile={profile} />
                        ))
                    ) : (
                        <h4>No profiles found...</h4>
                    )}
                </div>
            </Fragment>)}
        </Fragment>
    )

}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Profileitem = ({ profile: { user: {_id, name, avatar }, status, company, location, skills } }) => {
    return (
        <div className='profile bg-light'>
            <img src={avatar} alt='' className='round-img' />
            <div>
                <h2>{name}</h2>
                <p>
                    {status} {company && <span> at {company}</span>}
                </p>
                <p className='my-1'>{location && <span>{location}</span>}</p>
                <Link to={`/profile/${_id}`} className='btn btn-second'>
                    View Profile
                </Link>
            </div>
            <ul>
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className='text-second'>
                        <i className='fas fa-check' /> {skill}
                    </li>
                ))}
            </ul>
        </div>
    )
}

Profileitem.propTypes = {
    profile: PropTypes.object.isRequired
  };

export default Profileitem;
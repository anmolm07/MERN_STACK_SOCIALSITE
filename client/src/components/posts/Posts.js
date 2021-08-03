import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import Spinner from '../layouts/Spinner';
import PropTypes from 'prop-types';
import Postitem from './Postitem';
import PostForm from './PostForm';


const Posts = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts();
    }, [getPosts]);

    const [filterprofile, setFilterProfile] = useState('');
    const[textbox,setTextBox]=useState(false);

    return (loading ? <Spinner /> : <Fragment>
        <h1 className="large text-second">Posts</h1>
        <p className="lead">
            <i className="fas fa-user" /> Welcome to the community
        </p>
        <PostForm />
        <br />
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
                <small className="form-text">You can search all post by username</small>
            </div>
            <div className="form-group">
                <p>
                    <input
                        type="checkbox"
                        name="textbox"
                        checked={textbox}
                        value={textbox}
                        onChange={() => setTextBox(!textbox)}
                    />{' '}
                    search by text
                </p>
            </div>
        </div>
        <br />
        <div className="posts">
            {posts.map((post) => textbox ? post.text.toUpperCase().includes(filterprofile.toUpperCase()) && (
                <Postitem key={post._id} post={post} />) : post.name.toUpperCase().includes(filterprofile.toUpperCase()) && (
                    <Postitem key={post._id} post={post} />)
            )}
        </div>
    </Fragment>
    )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts);
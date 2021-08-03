import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { getPost } from '../../actions/post';
import Postitem from '../posts/Postitem';
import CommentForm from './CommentForm';
import Commentitem from './Commentitem';

const Post = ({ getPost, post: { post, loading }, match }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost]);

    return (loading || post === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Link to="/posts" className="btn btn-light">
                Back To Posts
            </Link>
            <br />
            <br />
            <Postitem post={post} showActions={false} />
            <br />
            <br />
            <CommentForm postId={post._id} />
            <div className="comments">
                {post.comments.map((comment) => (
                    <Commentitem key={comment._id} comment={comment} postId={post._id} />
                ))}
            </div>
        </Fragment>
    ))
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
import axios from "axios";
import { setAlert } from './alert';
import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    NO_REPOS
} from './types';


//get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });

    }
}


// create new profile or update 
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
    try {
        const res = await axios.put('/api/profile/experience', formData);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', 'success'));

        history.push('/dashboard');
    } catch (err) {
        console.log(err.response)
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


//add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        console.log(err)
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


//delte experience 
export const deleteExperience = (id) => async dispatch => {
    if (window.confirm("ARE YOU SURE ? ")) {
        try {
            const res = await axios.delete(`/api/profile/experience/${id}`);

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert("Experience Removed", 'success'));
            document.body.scrollTop = document.documentElement.scrollTop = 0;

        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }

    }

}


//delete education
export const deleteEducation = (id) => async dispatch => {
    if (window.confirm("ARE YOU SURE ? ")) {
        try {
            const res = await axios.delete(`/api/profile/education/${id}`);

            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert("Education Removed", 'success'));
            document.body.scrollTop = document.documentElement.scrollTop = 0;

        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }

    }
}

//delete account 
export const deleteAccount = () => async dispatch => {
    if (window.confirm("ARE YOU SURE ? THIS CAN'T BE UNDONE")) {
        try {
            await axios.delete('/api/profile');

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });

            dispatch(setAlert("Your Account is Permananetly Deleted"));

        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            });
        }
    }
}

//get all Profiles
export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


//get profile by id
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

//get the github repository 
export const getGithubRepos = (username) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: NO_REPOS
        });
    }
};
import { Fragment, useState } from "react";
import { Link ,Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import { register } from "../../actions/auth";

const Register = ({ setAlert,register ,isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
        avatar: null
    });
    const[imageText,setImageText]=useState('UPLOAD IMAGE')
    const { name, email, password, password2,avatar } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const uploadWidget = () => {
        window.cloudinary.openUploadWidget(
          {
            cloud_name:'cloudname',
            upload_preset:'upload_preset',
            tags: ['ebooks']
          },
          function (error, result) {
              if(!error)
              {
                setFormData({...formData,avatar:result[0].secure_url});
                setImageText('IMAGE UPLOADED');
              }
    
          }
        );
      };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
        else {
            register({name,email,password,avatar});
            setImageText('UPLOAD IMAGE');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

    }


    if(isAuthenticated)
    return <Redirect to="/dashboard"/>

    return (
        <Fragment>
            <div className="card bg-light">
                <h1 className="large text-second">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />
                        <small className="form-text">This site uses Gravatar so if you want a profile image, use a
                            Gravatar email</small>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                            value={password}
                            onChange={e => onChange(e)}
                        />
                        <small className="form-text">Password should be minimum of 8 character.</small>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            minLength="6"
                            value={password2}
                            onChange={e => onChange(e)}
                        />
                    </div>
                     
                     <div className="form-group">
                         <input  type="button" onClick={() => uploadWidget()} value={imageText} className="btn btn-second btn-block p-5"/>
                         <small className="form-text">if you want a profile image upload here or leave blank.</small>
                     </div>
                    

                    <input type="submit" className="btn btn-second" value="Register"/>
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </Fragment>
    );
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = (state) => ({
    isAuthenticated:state.auth.isAuthenticated
  });

export default connect(mapStateToProps, { setAlert ,register})(Register);
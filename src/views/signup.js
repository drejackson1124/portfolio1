import React, { useState, useContext } from 'react';
import helpers from '../helpers/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic error checking: all fields must be filled
    if (!email || !username || !password) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }

    // Check if password is at least 7 characters
    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      setSuccess('');
      return;
    }

    // Clear any previous error
    setError('');

    try {
      const result = await helpers.signup({ email, username, password });
      console.log(result);
      // You may want to handle success or error based on the API response here
      if(result.statusCode === 401){
        setError('Email already exists.');
      } else if (result.statusCode === 402){
        setError('Username is taken.');
      } else if (result.statusCode === 200){
        setUser({ email, username });
        navigate("/");
      } else {
        setError('Sorry, something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">
            Sign Up or <Link to="/signin">Sign In</Link>
          </h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="7"  // This is the HTML validation attribute
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;


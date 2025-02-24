import React, { useState, useContext } from 'react';
import helpers from '../helpers/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic error checking
    if (!username || !password) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }

    setError('');
    try {
      // Call your sign in API helper function
      const result = await helpers.signin({ username, password });

      // Assuming result.status contains the HTTP status code
      if (result.statusCode === 200) {
        setSuccess('Sign in successful!');
        // Set user context with the returned user data (adjust as needed)
        setUser(JSON.parse(result.body));
        navigate('/');
      } else if (result.statusCode === 400) {
        setError('Incorrect password.');
      } else if (result.statusCode === 404) {
        setError('Username not found.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">
            Sign In or <Link to="/signup">Sign Up</Link>
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
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;

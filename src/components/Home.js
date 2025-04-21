import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error', error);
      alert('Invalid credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', {
        email,
        password,
      });
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration error', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="home-container">
      <h2>Login or Register</h2>
      <form onSubmit={handleLogin} className="form-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="buttons">
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div>
//       <h2>Home Page</h2>
//       <p>Welcome to the homepage!</p>
//       <Link to="/dashboard">Go to Dashboard</Link>
//     </div>
//   );
// };

// export default Home;

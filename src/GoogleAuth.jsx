import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import "./GoogleAuth.css"
function GoogleAuth({ onLogin }) {
  
  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        'https://soc-net.info/harfa/google-login.php',
        { token: credentialResponse.credential }
      );
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
      
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => console.log('Login Failed')}
    />
  );
}

export default GoogleAuth;

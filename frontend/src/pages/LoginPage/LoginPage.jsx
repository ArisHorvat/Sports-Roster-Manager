import './LoginPage.css';

import Title from '../../components/Title/Title'
import Login from '../../components/Login/Login'


function LoginPage() {

  return (
    <div className="login-page">
        <Title text="NFL ROSTER MANAGER"/>
        <Login text="LOGIN"/>
    </div>
  );
}

export default LoginPage;

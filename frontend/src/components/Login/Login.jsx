import './Login.css';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

import MyInput from '../MyInput/MyInput';
import MyButton from '../MyButton/MyButton';

import { ServiceContext } from '../../ServiceContext';
import { TeamAccountContext } from '../../TeamAccountContext';

function Login(props) {
    const { accountService } = useContext(ServiceContext);
    const { teamId, setTeamId } = useContext(TeamAccountContext); 

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = async () => {
        try {
            const account = await accountService.login(username, password);
            const decodedAccount = jwtDecode(account);

            setTeamId(decodedAccount.teamId);

            navigate(`/home`, { state: { decodedAccount } });
        } 
        catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login-container">
            <MyInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                text="Username"
                placeholder="Enter Username..."
            />
            <MyInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                text="Password"
                placeholder="Enter Password..."
                type="password"
            />
            <MyButton text="Log In" onClick={handleLoginClick} />
        </div>
    );
}

export default Login;

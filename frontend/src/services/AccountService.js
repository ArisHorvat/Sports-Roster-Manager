import axios from 'axios';

export class AccountService {
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;
        console.log('API URL:', this.baseUrl); // Debug log
    }

    async login(username, password) {
        try {
            console.log('Making request to:', `${this.baseUrl}/accounts/login`); // Debug log
            const response = await axios.post(`${this.baseUrl}/accounts/login`, { username, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200) {
                throw new Error('Invalid credentials');
            }

            localStorage.setItem('token', response.data);  // Store token in localStorage

            return response.data;
        } 
        catch (error) {
            console.error('Login error:', error); // Debug log
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);  // Show backend error
            } 
            else {
                throw new Error("Login failed!");
            }
        }
    }
}

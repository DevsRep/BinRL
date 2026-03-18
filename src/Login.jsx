import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Link } from "react-router-dom";
import Header from "./Header";


function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await login(email, password);
            Navigate("/linkdir");
        } catch (error) {
            setError("Failed to login", error);
        }
    }


    return (
        <div className="login-o-cont">
            <Header  />

            <div className="login-cont">
                <div className="login-i-cont">
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Login</h2>
                        {error && <p className="error" style={{color:"red", fontSize:"10px"}}>{error}</p>}
                        <div className="form-group">
                            <input 
                                id="login-email"
                                name="login-email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                id="login-password"
                                name="login-password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">Sign In</button>

                    </form>

                    <div style={{color: 'var(--text-secondary)', padding: '0px 5px 7px 5px', fontSize: '14px'}}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Sign Up</Link>
                    </div>
                </div>

            </div>
            
            
        </div>
    );
}


export default Login;
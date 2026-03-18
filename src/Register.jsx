import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Header from "./Header";


function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Display Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="input-field"
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{color: 'var(--text-secondary)', padding: '0px 5px 7px 5px', fontSize: '14px'}}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
                    </div>
                </div>

            </div>
            
            
        </div>
    );
}


export default Register;
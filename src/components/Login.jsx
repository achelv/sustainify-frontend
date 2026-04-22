import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan Password wajib diisi");
      return;
    }

    // Dummy login
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/dashboard");
    } else {
      alert("Email atau Password salah");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label>Email :</label>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password :</label>
        <input
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Masuk</button>

        <p className="register">
          Belum punya akun? <span>Daftar</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
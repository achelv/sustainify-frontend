import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      return;
    }

    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/dashboard");
    } else {
      setError("Email atau Password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="flex shadow-2xl w-full max-w-3xl bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>

        {/* Left Panel */}
        <div
          className="hidden md:flex relative w-2/5 flex-col items-center justify-center p-10 overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #054f20, #06702D, #089038)",
            borderRadius: "16px 50px 50px 16px",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white opacity-10" />
          <div className="absolute bottom-10 -right-10 w-52 h-52 rounded-full bg-white opacity-10" />

          <div className="relative z-10 text-center text-white">
            {/* Leaf SVG */}
            <div className="mb-6 flex justify-center">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 22L12 12"/>
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12c0-2.76 1.12-5.26 2.93-7.07A9.96 9.96 0 0 1 12 2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 leading-tight">Selamat datang</h2>
            <p className="text-sm leading-relaxed opacity-90">
              Masuk untuk melanjutkan perjalananmu dalam memantau dan mengurangi jejak karbon. Setiap langkah kecilmu berarti untuk bumi.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12 bg-white">
          <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: "#06702D" }}>
            Masuk
          </h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#333" }}>
                Email :
              </label>
              <input
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200"
                style={{
                  borderColor: focused === "email" ? "#06702D" : "#ccc",
                  boxShadow: focused === "email" ? "0 0 0 3px rgba(6,112,45,0.15)" : "none",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#333" }}>
                Password :
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-200"
                style={{
                  borderColor: focused === "password" ? "#06702D" : "#ccc",
                  boxShadow: focused === "password" ? "0 0 0 3px rgba(6,112,45,0.15)" : "none",
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #054f20, #06702D)",
                boxShadow: "0 4px 14px rgba(6,112,45,0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Masuk
            </button>

            {/* Register */}
            <p className="text-center text-sm" style={{ color: "#888" }}>
              Belum punya akun?{" "}
              <span
                className="font-semibold cursor-pointer"
                style={{ color: "#06702D" }}
                onClick={() => navigate("/register")}
              >
                Daftar
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import "../assets/css/Auth.css";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        try {
            setLoading(true);
            await authService.login(form);
            navigate("/"); // Về trang chủ sau khi login
        } catch (err) {
            setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* ── Left visual ── */}
            <div className="auth-visual">
                <div className="auth-visual-bg" />
                <div className="auth-visual-content">
                    <span className="auth-visual-emoji">🥐</span>
                    <h2 className="auth-visual-title">
                        Chào mừng<br />trở lại <em>Bakery House</em>
                    </h2>
                    <p className="auth-visual-desc">
                        Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích
                        và nhận ưu đãi dành riêng cho bạn.
                    </p>
                    <div className="auth-visual-badges">
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🎁</span>
                            <div className="auth-badge-text">
                                <strong>Ưu đãi thành viên</strong>
                                Giảm 10% cho đơn hàng đầu tiên
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">📦</span>
                            <div className="auth-badge-text">
                                <strong>Theo dõi đơn hàng</strong>
                                Xem trạng thái đơn hàng realtime
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">❤️</span>
                            <div className="auth-badge-text">
                                <strong>Danh sách yêu thích</strong>
                                Lưu bánh ngon để đặt lần sau
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form ── */}
            <div className="auth-form-panel">
                <div className="auth-form-wrap">

                    <a href="/" className="auth-logo">
                        <span className="auth-logo-icon">🥐</span>
                        <span className="auth-logo-name">Bakery House</span>
                    </a>

                    <h1 className="auth-heading">Đăng <em>nhập</em></h1>
                    <p className="auth-subheading">Nhập thông tin tài khoản của bạn</p>

                    {error && <div className="auth-alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-group">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`auth-input ${error ? "error" : ""}`}
                                placeholder="example@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-group">
                            <label className="auth-label">Mật khẩu</label>
                            <div className="auth-input-wrap">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    name="password"
                                    className={`auth-input ${error ? "error" : ""}`}
                                    placeholder="Nhập mật khẩu..."
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="auth-eye"
                                    onClick={() => setShowPwd(!showPwd)}
                                >
                                    {showPwd ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>
                        <Link to="/forgot-password" className="auth-forgot">
                            Quên mật khẩu?
                        </Link>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
                        </button>
                    </form>

                    <div className="auth-divider"><span>hoặc</span></div>

                    <div className="auth-switch">
                        Chưa có tài khoản?{" "}
                        <Link to="/register">Đăng ký ngay</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Login;

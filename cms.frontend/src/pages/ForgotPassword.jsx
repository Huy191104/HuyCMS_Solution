import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import logoImg from "../assets/images/logo.png";
import "../assets/css/Auth.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // DEV: lưu token để dễ test
    const [devToken, setDevToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setStatus("error");
            setMessage("Vui lòng nhập địa chỉ email.");
            return;
        }
        try {
            setLoading(true);
            setStatus(null);
            const data = await authService.forgotPassword(email);
            setStatus("success");
            setMessage(data.message);
            // DEV: hiển thị token để test (xóa trong production)
            if (data.devToken) setDevToken(data.devToken);
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
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
                    <span className="auth-visual-emoji">🔑</span>
                    <h2 className="auth-visual-title">
                        Quên <em>mật khẩu?</em>
                    </h2>
                    <p className="auth-visual-desc">
                        Đừng lo! Chỉ cần nhập email đã đăng ký và chúng tôi sẽ
                        gửi hướng dẫn đặt lại mật khẩu ngay lập tức.
                    </p>
                    <div className="auth-visual-badges">
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🛡️</span>
                            <div className="auth-badge-text">
                                <strong>Bảo mật tuyệt đối</strong>
                                Token hết hạn sau 1 giờ
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">⚡</span>
                            <div className="auth-badge-text">
                                <strong>Nhanh chóng</strong>
                                Đặt lại mật khẩu chỉ trong vài bước
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">✅</span>
                            <div className="auth-badge-text">
                                <strong>Dễ dàng</strong>
                                Không cần nhớ mật khẩu cũ
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right form ── */}
            <div className="auth-form-panel">
                <div className="auth-form-wrap">

                    <Link to="/" className="auth-logo">
                        <img src={logoImg} alt="Bakery House Logo" className="auth-logo-img" />
                        <span className="auth-logo-name">Bakery House</span>
                    </Link>

                    <h1 className="auth-heading">Quên <em>mật khẩu</em></h1>
                    <p className="auth-subheading">
                        Nhập email đăng ký để nhận liên kết đặt lại mật khẩu
                    </p>

                    {/* Alert messages */}
                    {status === "error" && (
                        <div className="auth-alert">{message}</div>
                    )}
                    {status === "success" && (
                        <div className="auth-alert success">
                            ✅ {message}
                        </div>
                    )}

                    {/* DEV helper: hiển thị link reset để test */}
                    {devToken && (
                        <div className="auth-dev-box">
                            <strong>🛠 DEV MODE</strong> — Link đặt lại mật khẩu:
                            <br />
                            <Link to={`/reset-password?token=${devToken}`} className="auth-dev-link">
                                /reset-password?token={devToken.slice(0, 16)}...
                            </Link>
                        </div>
                    )}

                    {!status || status === "error" ? (
                        <form onSubmit={handleSubmit}>
                            <div className="auth-group">
                                <label className="auth-label">Địa chỉ Email</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    className={`auth-input ${status === "error" ? "error" : ""}`}
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setStatus(null);
                                    }}
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>

                            <button
                                id="forgot-submit-btn"
                                type="submit"
                                className="auth-btn"
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Gửi liên kết đặt lại →"}
                            </button>
                        </form>
                    ) : (
                        <button
                            className="auth-btn"
                            style={{ marginTop: "8px" }}
                            onClick={() => {
                                setStatus(null);
                                setMessage("");
                                setEmail("");
                                setDevToken("");
                            }}
                        >
                            Thử email khác
                        </button>
                    )}

                    <div className="auth-divider"><span>hoặc</span></div>

                    <div className="auth-switch">
                        Nhớ mật khẩu rồi?{" "}
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>

                    <div className="auth-switch" style={{ marginTop: "8px" }}>
                        Chưa có tài khoản?{" "}
                        <Link to="/register">Đăng ký ngay</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ForgotPassword;

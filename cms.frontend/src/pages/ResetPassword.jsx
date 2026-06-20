import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import authService from "../services/authService";
import "../assets/css/Auth.css";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";

    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Kiểm tra token tồn tại trong URL
    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Liên kết không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.");
        }
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setStatus(null);
        setMessage("");
    };

    const validate = () => {
        if (!form.newPassword || !form.confirmPassword) {
            return "Vui lòng điền đầy đủ thông tin.";
        }
        if (form.newPassword.length < 6) {
            return "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        if (form.newPassword !== form.confirmPassword) {
            return "Mật khẩu xác nhận không khớp.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            setStatus("error");
            setMessage(error);
            return;
        }
        try {
            setLoading(true);
            const data = await authService.resetPassword(
                token,
                form.newPassword,
                form.confirmPassword
            );
            setStatus("success");
            setMessage(data.message);
            // Tự động chuyển về login sau 3 giây
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Tính độ mạnh mật khẩu
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { level: 1, label: "Yếu", color: "#DC3545" };
        if (score <= 3) return { level: 2, label: "Trung bình", color: "#FFC107" };
        return { level: 3, label: "Mạnh", color: "#28A745" };
    };

    const strength = getPasswordStrength(form.newPassword);

    return (
        <div className="auth-page">

            {/* ── Left visual ── */}
            <div className="auth-visual">
                <div className="auth-visual-bg" />
                <div className="auth-visual-content">
                    <span className="auth-visual-emoji">🔒</span>
                    <h2 className="auth-visual-title">
                        Đặt lại <em>mật khẩu</em>
                    </h2>
                    <p className="auth-visual-desc">
                        Tạo mật khẩu mới an toàn cho tài khoản của bạn.
                        Đảm bảo mật khẩu dễ nhớ nhưng khó đoán.
                    </p>
                    <div className="auth-visual-badges">
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🔐</span>
                            <div className="auth-badge-text">
                                <strong>Tối thiểu 6 ký tự</strong>
                                Nên dùng chữ hoa, số và ký tự đặc biệt
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">⏰</span>
                            <div className="auth-badge-text">
                                <strong>Token có thời hạn</strong>
                                Liên kết hết hạn sau 1 giờ kể từ khi yêu cầu
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🚀</span>
                            <div className="auth-badge-text">
                                <strong>Đăng nhập ngay</strong>
                                Sau khi đặt lại, bạn có thể dùng mật khẩu mới
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

                    <h1 className="auth-heading">Đặt lại <em>mật khẩu</em></h1>
                    <p className="auth-subheading">Tạo mật khẩu mới cho tài khoản của bạn</p>

                    {/* Alert messages */}
                    {status === "error" && (
                        <div className="auth-alert">{message}</div>
                    )}
                    {status === "success" && (
                        <div className="auth-alert success">
                            ✅ {message}
                            <br />
                            <small>Đang chuyển đến trang đăng nhập...</small>
                        </div>
                    )}

                    {status !== "success" && token && (
                        <form onSubmit={handleSubmit}>

                            {/* Mật khẩu mới */}
                            <div className="auth-group">
                                <label className="auth-label">Mật khẩu mới</label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="reset-new-password"
                                        type={showPwd ? "text" : "password"}
                                        name="newPassword"
                                        className={`auth-input ${status === "error" && !form.newPassword ? "error" : ""}`}
                                        placeholder="Nhập mật khẩu mới..."
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye"
                                        onClick={() => setShowPwd(!showPwd)}
                                    >
                                        {showPwd ? "🙈" : "👁️"}
                                    </button>
                                </div>

                                {/* Thanh độ mạnh mật khẩu */}
                                {form.newPassword && (
                                    <div className="auth-strength">
                                        <div className="auth-strength-bar">
                                            <div
                                                className="auth-strength-fill"
                                                style={{
                                                    width: `${(strength.level / 3) * 100}%`,
                                                    backgroundColor: strength.color,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="auth-strength-label"
                                            style={{ color: strength.color }}
                                        >
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div className="auth-group">
                                <label className="auth-label">Xác nhận mật khẩu</label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="reset-confirm-password"
                                        type={showConfirmPwd ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`auth-input ${
                                            form.confirmPassword &&
                                            form.newPassword !== form.confirmPassword
                                                ? "error"
                                                : ""
                                        }`}
                                        placeholder="Nhập lại mật khẩu..."
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye"
                                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                    >
                                        {showConfirmPwd ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {form.confirmPassword &&
                                    form.newPassword !== form.confirmPassword && (
                                        <span className="auth-error-msg">
                                            ❌ Mật khẩu không khớp
                                        </span>
                                    )}
                                {form.confirmPassword &&
                                    form.newPassword === form.confirmPassword && (
                                        <span
                                            className="auth-error-msg"
                                            style={{ color: "#15803D" }}
                                        >
                                            ✅ Mật khẩu khớp
                                        </span>
                                    )}
                            </div>

                            <button
                                id="reset-submit-btn"
                                type="submit"
                                className="auth-btn"
                                disabled={loading}
                            >
                                {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu →"}
                            </button>
                        </form>
                    )}

                    {/* Token không hợp lệ: hướng dẫn thử lại */}
                    {!token && (
                        <div style={{ marginTop: "16px" }}>
                            <Link to="/forgot-password" className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "12px" }}>
                                Yêu cầu đặt lại mật khẩu mới
                            </Link>
                        </div>
                    )}

                    <div className="auth-divider"><span>hoặc</span></div>

                    <div className="auth-switch">
                        Nhớ mật khẩu rồi?{" "}
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ResetPassword;

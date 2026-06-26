import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import logoImg from "../assets/images/logo.png";
import "../assets/css/Auth.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "", email: "", password: "",
        confirmPassword: "", phone: "", address: ""
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const validate = () => {
        if (!form.fullName || !form.email || !form.password || !form.confirmPassword)
            return "Vui lòng điền đầy đủ các trường bắt buộc.";
        if (form.password.length < 3)
            return "Mật khẩu phải có ít nhất 3 ký tự.";
        if (form.password !== form.confirmPassword)
            return "Mật khẩu xác nhận không khớp.";
        if (form.phone && form.phone.trim() !== "") {
            const cleanPhone = form.phone.trim();
            if (!/^\d{10}$/.test(cleanPhone)) {
                return "Số điện thoại phải gồm đúng 10 chữ số.";
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        try {
            setLoading(true);
            await authService.register({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone,
                address: form.address,
            });
            setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
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
                    <span className="auth-visual-emoji">🎂</span>
                    <h2 className="auth-visual-title">
                        Tham gia<br /><em>Bakery House</em>
                    </h2>
                    <p className="auth-visual-desc">
                        Tạo tài khoản miễn phí để đặt bánh nhanh hơn,
                        nhận ưu đãi độc quyền và theo dõi đơn hàng dễ dàng.
                    </p>
                    <div className="auth-visual-badges">
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🎉</span>
                            <div className="auth-badge-text">
                                <strong>Quà tặng chào mừng</strong>
                                Miễn phí vận chuyển cho đơn hàng đầu tiên
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🔔</span>
                            <div className="auth-badge-text">
                                <strong>Thông báo sớm</strong>
                                Nhận tin bánh mới và khuyến mãi
                            </div>
                        </div>
                        <div className="auth-visual-badge">
                            <span className="auth-badge-icon">🚀</span>
                            <div className="auth-badge-text">
                                <strong>Đặt hàng nhanh hơn</strong>
                                Lưu địa chỉ giao hàng cho lần sau
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

                    <h1 className="auth-heading">Tạo tài <em>khoản</em></h1>
                    <p className="auth-subheading">Điền thông tin để đăng ký thành viên</p>

                    {error && <div className="auth-alert">{error}</div>}
                    {success && <div className="auth-alert success">{success}</div>}

                    <form onSubmit={handleSubmit}>

                        {/* Họ tên + Email */}
                        <div className="auth-row">
                            <div className="auth-group">
                                <label className="auth-label">Họ và tên <span style={{ color: "#DC3545" }}>*</span></label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="auth-input"
                                    placeholder="Nguyễn Văn A"
                                    value={form.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="auth-group">
                                <label className="auth-label">Email <span style={{ color: "#DC3545" }}>*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    className="auth-input"
                                    placeholder="example@gmail.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password + Confirm */}
                        <div className="auth-row">
                            <div className="auth-group">
                                <label className="auth-label">Mật khẩu <span style={{ color: "#DC3545" }}>*</span></label>
                                <div className="auth-input-wrap">
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        name="password"
                                        className="auth-input"
                                        placeholder="Tối thiểu 6 ký tự"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className="auth-eye" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>
                            <div className="auth-group">
                                <label className="auth-label">Xác nhận mật khẩu <span style={{ color: "#DC3545" }}>*</span></label>
                                <div className="auth-input-wrap">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        className="auth-input"
                                        placeholder="Nhập lại mật khẩu"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button type="button" className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Phone + Address */}
                        <div className="auth-row">
                            <div className="auth-group">
                                <label className="auth-label">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="auth-input"
                                    placeholder="0909123456"
                                    value={form.phone}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                            </div>
                            <div className="auth-group">
                                <label className="auth-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="auth-input"
                                    placeholder="TP. Hồ Chí Minh"
                                    value={form.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Đang đăng ký..." : "Tạo tài khoản →"}
                        </button>

                    </form>

                    <div className="auth-divider"><span>hoặc</span></div>

                    <div className="auth-switch">
                        Đã có tài khoản?{" "}
                        <Link to="/login">Đăng nhập ngay</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Register;

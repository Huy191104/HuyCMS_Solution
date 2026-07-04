import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Profile.css";

export default function ChangePassword() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Chuyển hướng nếu chưa đăng nhập
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (message.text) setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.oldPassword) {
            setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại." });
            return;
        }
        if (formData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
            return;
        }
        if (formData.newPassword !== formData.confirmNewPassword) {
            setMessage({ type: "error", text: "Mật khẩu mới và xác nhận mật khẩu mới không trùng khớp." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });

            await authService.changePassword(user.id, formData.oldPassword, formData.newPassword);

            setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
            setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại sau.",
            });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name = "") => {
        return name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
    };

    if (!user) return null;

    return (
        <>
            <Header />

            {/* Hero Section */}
            <div className="pf-hero">
                <div className="pf-hero-bg" />
                <div className="pf-hero-inner">
                    <div className="pf-hero-eyebrow">Tài khoản</div>
                    <h1 className="pf-hero-title">Đổi <em>mật khẩu</em></h1>
                    <p className="pf-hero-sub">
                        Cập nhật và thay đổi mật khẩu của bạn để bảo mật tài khoản tốt hơn
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="pf-page">
                <div className="pf-layout">

                    {/* Sidebar Card */}
                    <div className="pf-sidebar">
                        <div className="pf-profile-card">
                            <div className="pf-avatar">
                                {getInitials(user.fullName)}
                            </div>
                            <h3 className="pf-profile-name">{user.fullName}</h3>
                            <p className="pf-profile-role">Khách hàng thành viên</p>
                            
                            <div className="pf-profile-divider" />
                            
                            <div className="pf-quick-info">
                                <div className="pf-qi-item">
                                    <span className="pf-qi-icon">📧</span>
                                    <div>
                                        <div className="pf-qi-label">Email</div>
                                        <div className="pf-qi-val">{user.email}</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="pf-orders-btn"
                                onClick={() => navigate("/profile")}
                            >
                                👤 Thông tin cá nhân
                            </button>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="pf-main">
                        <div className="pf-form-card">
                            <h2 className="pf-form-title">Đổi mật khẩu tài khoản</h2>
                            <p className="pf-form-sub">Nhập mật khẩu hiện tại và mật khẩu mới của bạn</p>

                            {message.text && (
                                <div className={`pf-alert pf-alert--${message.type}`}>
                                    <span className="pf-alert-icon">
                                        {message.type === "success" ? "✓" : "⚠️"}
                                    </span>
                                    <span className="pf-alert-text">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="pf-form">
                                <div className="pf-group">
                                    <label className="pf-label">Mật khẩu hiện tại <span>*</span></label>
                                    <div className="pf-input-wrap">
                                        <input 
                                            type={showOldPassword ? "text" : "password"}
                                            name="oldPassword"
                                            className="pf-input" 
                                            placeholder="Nhập mật khẩu hiện tại..."
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="pf-eye"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                        >
                                            {showOldPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Mật khẩu mới <span>*</span></label>
                                    <div className="pf-input-wrap">
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            className="pf-input" 
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="pf-eye"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Xác nhận mật khẩu mới <span>*</span></label>
                                    <div className="pf-input-wrap">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmNewPassword"
                                            className="pf-input" 
                                            placeholder="Xác nhận lại mật khẩu mới..."
                                            value={formData.confirmNewPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="pf-eye"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`pf-submit-btn ${loading ? "pf-submit-btn--loading" : ""}`}
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}

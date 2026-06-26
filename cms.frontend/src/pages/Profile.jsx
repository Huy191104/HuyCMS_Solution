import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import customerService from "../services/customerService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Tải dữ liệu ban đầu từ localStorage
        setFormData({
            id: user.id || "",
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
        });

        // Tải dữ liệu mới nhất từ database để đảm bảo đồng bộ
        fetchLatestProfile(user.id);
    }, []);

    const fetchLatestProfile = async (customerId) => {
        try {
            const data = await customerService.getProfile(customerId);
            if (data) {
                const latestUser = {
                    id: data.id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone || "",
                    address: data.address || "",
                };
                setFormData(latestUser);
                // Cập nhật lại localStorage nếu có thay đổi từ DB
                localStorage.setItem("customer", JSON.stringify(latestUser));
                window.dispatchEvent(new Event("userUpdated"));
            }
        } catch (e) {
            console.error("Không thể tải thông tin mới nhất từ DB:", e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Xóa thông báo khi gõ tiếp
        if (message.text) setMessage({ type: "", text: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.fullName.trim()) {
            setMessage({ type: "error", text: "Vui lòng nhập Họ và tên đầy đủ." });
            return;
        }
        if (!formData.email.trim()) {
            setMessage({ type: "error", text: "Vui lòng nhập địa chỉ Email." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });

            // Call API
            await customerService.updateProfile(user.id, {
                id: parseInt(user.id),
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                // Password được giữ nguyên từ backend (không cập nhật password ở đây)
            });

            // Cập nhật thông tin mới vào localStorage
            const updatedUser = {
                ...user,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
            };
            localStorage.setItem("customer", JSON.stringify(updatedUser));

            // Kích hoạt sự kiện để Header đồng bộ ngay lập tức
            window.dispatchEvent(new Event("userUpdated"));

            setMessage({ type: "success", text: "Cập nhật thông tin tài khoản thành công!" });
        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại sau.",
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
                    <h1 className="pf-hero-title">Hồ sơ <em>cá nhân</em></h1>
                    <p className="pf-hero-sub">
                        Quản lý và cập nhật thông tin mua sắm của bạn tại Bakery House
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
                                {getInitials(formData.fullName || user.fullName)}
                            </div>
                            <h3 className="pf-profile-name">{formData.fullName || user.fullName}</h3>
                            <p className="pf-profile-role">Khách hàng thành viên</p>
                            
                            <div className="pf-profile-divider" />
                            
                            <div className="pf-quick-info">
                                <div className="pf-qi-item">
                                    <span className="pf-qi-icon">📧</span>
                                    <div>
                                        <div className="pf-qi-label">Email</div>
                                        <div className="pf-qi-val">{formData.email || user.email}</div>
                                    </div>
                                </div>
                                <div className="pf-qi-item">
                                    <span className="pf-qi-icon">📞</span>
                                    <div>
                                        <div className="pf-qi-label">Số điện thoại</div>
                                        <div className="pf-qi-val">{formData.phone || "Chưa cập nhật"}</div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="pf-orders-btn"
                                onClick={() => navigate("/orders")}
                            >
                                📦 Đơn hàng của tôi
                            </button>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="pf-main">
                        <div className="pf-form-card">
                            <h2 className="pf-form-title">Thông tin tài khoản</h2>
                            <p className="pf-form-sub">Cập nhật thông tin liên hệ và nhận bánh của bạn</p>

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
                                    <label className="pf-label">Mã khách hàng</label>
                                    <input 
                                        type="text" 
                                        className="pf-input pf-input--readonly" 
                                        value={`#${formData.id}`} 
                                        readOnly 
                                    />
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Họ và tên <span>*</span></label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        className="pf-input" 
                                        placeholder="Nhập họ và tên..."
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Địa chỉ Email <span>*</span></label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="pf-input" 
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Số điện thoại</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        className="pf-input" 
                                        placeholder="Nhập số điện thoại..."
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pf-group">
                                    <label className="pf-label">Địa chỉ nhận hàng mặc định</label>
                                    <textarea 
                                        name="address"
                                        className="pf-input pf-textarea" 
                                        rows="3"
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className={`pf-submit-btn ${loading ? "pf-submit-btn--loading" : ""}`}
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Lưu thay đổi"}
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

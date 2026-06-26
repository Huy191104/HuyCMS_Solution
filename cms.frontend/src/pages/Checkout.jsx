import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import orderService from "../services/orderService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Checkout.css";
import { IMAGE_BASE_URL } from "../api/config";

const API_BASE = IMAGE_BASE_URL;
const formatVND = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

export default function Checkout() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Form — tự điền từ account nếu đã đăng nhập
    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        address: user?.address || "",
        notes: "",
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("cart") || "[]");
        if (saved.length === 0) navigate("/cart");
        setCart(saved);
    }, []);

    // Redirect về login nếu chưa đăng nhập
    useEffect(() => {
        if (!user) navigate("/login");
    }, []);

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.phone || !form.address) {
            setError("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }

        try {
            setLoading(true);
            const res = await orderService.createOrder({
                customerId: user.id,
                notes: `Giao cho: ${form.fullName} | SĐT: ${form.phone} | Địa chỉ: ${form.address}${form.notes ? " | Ghi chú: " + form.notes : ""}`,
                items: cart.map((i) => ({
                    productId: i.id,
                    quantity: i.quantity,
                })),
            });

            // Xóa cart
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));

            setOrderId(res.orderId);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // ── Success screen ──
    if (success) {
        return (
            <>
                <Header />
                <div className="ck-success">
                    <div className="ck-success-icon">🎉</div>
                    <h2 className="ck-success-title">Đặt hàng thành công!</h2>
                    <p className="ck-success-sub">
                        Cảm ơn bạn đã tin tưởng Bakery House.<br />
                        Mã đơn hàng: <strong>#{orderId}</strong>
                    </p>
                    <div className="ck-success-actions">
                        <button onClick={() => navigate("/")}>Về trang chủ</button>
                        <button className="ck-outline" onClick={() => navigate("/products")}>
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* Hero */}
            <div className="ck-hero">
                <div className="ck-hero-bg" />
                <div className="ck-hero-inner">
                    <div className="ck-hero-eyebrow">Đặt hàng</div>
                    <h1 className="ck-hero-title">Thanh <em>toán</em></h1>
                    <p className="ck-hero-sub">Điền thông tin giao hàng để hoàn tất đơn</p>
                </div>
            </div>

            <div className="ck-page">
                <form onSubmit={handleSubmit}>
                    <div className="ck-layout">

                        {/* ── Left: Form ── */}
                        <div className="ck-form-col">

                            <div className="ck-card">
                                <div className="ck-card-title">Thông tin giao hàng</div>

                                {error && <div className="ck-alert">{error}</div>}

                                <div className="ck-group">
                                    <label className="ck-label">Họ và tên <span>*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="ck-input"
                                        placeholder="Nguyễn Văn A"
                                        value={form.fullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="ck-row">
                                    <div className="ck-group">
                                        <label className="ck-label">Số điện thoại <span>*</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="ck-input"
                                            placeholder="0909 123 456"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="ck-group">
                                        <label className="ck-label">Địa chỉ giao hàng <span>*</span></label>
                                        <input
                                            type="text"
                                            name="address"
                                            className="ck-input"
                                            placeholder="Số nhà, đường, quận..."
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="ck-group">
                                    <label className="ck-label">Ghi chú thêm</label>
                                    <textarea
                                        name="notes"
                                        className="ck-input"
                                        rows="3"
                                        placeholder="Yêu cầu đặc biệt, giao ngoài giờ hành chính..."
                                        value={form.notes}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Payment method (UI only) */}
                            <div className="ck-card">
                                <div className="ck-card-title">Phương thức thanh toán</div>
                                <div className="ck-pay-option ck-pay-option--active">
                                    <span>💵</span>
                                    <div>
                                        <div className="ck-pay-name">Thanh toán khi nhận hàng (COD)</div>
                                        <div className="ck-pay-desc">Trả tiền mặt khi nhận bánh</div>
                                    </div>
                                    <div className="ck-pay-check">✓</div>
                                </div>
                            </div>

                        </div>

                        {/* ── Right: Summary ── */}
                        <div className="ck-summary-col">
                            <div className="ck-card">
                                <div className="ck-card-title">Đơn hàng của bạn</div>

                                {cart.map((item) => (
                                    <div className="ck-order-item" key={item.id}>
                                        <div className="ck-order-item-img">
                                            {item.imageUrl ? (
                                                <img src={`${API_BASE}${item.imageUrl}`} alt={item.name} />
                                            ) : (
                                                <span>🍞</span>
                                            )}
                                            <span className="ck-order-item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="ck-order-item-name">{item.name}</div>
                                        <div className="ck-order-item-price">
                                            {formatVND(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}

                                <div className="ck-divider" />

                                <div className="ck-summary-row">
                                    <span>Tạm tính</span>
                                    <span>{formatVND(total)}</span>
                                </div>
                                <div className="ck-summary-row">
                                    <span>Phí giao hàng</span>
                                    <span className="ck-free">Miễn phí</span>
                                </div>

                                <div className="ck-divider" />

                                <div className="ck-summary-total">
                                    <span>Tổng cộng</span>
                                    <span>{formatVND(total)}</span>
                                </div>

                                <button
                                    type="submit"
                                    className="ck-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "🎂 Xác nhận đặt hàng"}
                                </button>

                                <p className="ck-terms">
                                    Bằng cách đặt hàng, bạn đồng ý với{" "}
                                    <Link to="/terms">điều khoản sử dụng</Link> của chúng tôi.
                                </p>
                            </div>
                        </div>

                    </div>
                </form>
            </div>

            <Footer />
        </>
    );
}

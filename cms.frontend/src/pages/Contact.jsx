import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Contact.css";

const CONTACT_INFO = [
    { icon: "📍", title: "Địa chỉ", value: "123 Đường Bánh Ngọt, Quận 1, TP. Hồ Chí Minh" },
    { icon: "📞", title: "Điện thoại", value: "0909 123 456" },
    { icon: "✉️", title: "Email", value: "hello@bakeryhouse.vn" },
    { icon: "🕐", title: "Giờ mở cửa", value: "Thứ 2 – Thứ 7: 07:00 – 21:00\nChủ nhật: 08:00 – 18:00" },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Header />

            {/* Hero */}
            <div className="ct-hero">
                <div className="ct-hero-bg" />
                <div className="ct-hero-inner">
                    <div className="ct-hero-eyebrow">Liên hệ</div>
                    <h1 className="ct-hero-title">Kết nối <em>cùng chúng tôi</em></h1>
                    <p className="ct-hero-sub">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
                </div>
            </div>

            <div className="ct-page">
                <div className="ct-layout">

                    {/* ── Left: Info ── */}
                    <div className="ct-info-col">
                        <div className="ct-eyebrow">Thông tin liên hệ</div>
                        <h2 className="ct-title">Chúng tôi ở <em>đây</em> cho bạn</h2>
                        <p className="ct-desc">
                            Có câu hỏi về sản phẩm, đặt hàng số lượng lớn hay chỉ muốn nói chuyện về bánh?
                            Đừng ngần ngại liên hệ với chúng tôi!
                        </p>

                        <div className="ct-info-list">
                            {CONTACT_INFO.map((c, i) => (
                                <div className="ct-info-item" key={i}>
                                    <div className="ct-info-icon">{c.icon}</div>
                                    <div>
                                        <div className="ct-info-title">{c.title}</div>
                                        <div className="ct-info-value">{c.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="ct-map">
                            <span>🗺️</span>
                            <p>Bản đồ sẽ được tích hợp tại đây</p>
                        </div>
                    </div>

                    {/* ── Right: Form ── */}
                    <div className="ct-form-col">
                        <div className="ct-form-card">
                            <div className="ct-form-title">Gửi tin nhắn cho chúng tôi</div>
                            <div className="ct-form-sub">Chúng tôi sẽ phản hồi trong vòng 24 giờ</div>

                            {submitted ? (
                                <div className="ct-success">
                                    <span>🎉</span>
                                    <h3>Gửi thành công!</h3>
                                    <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!</p>
                                    <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>
                                        Gửi tin nhắn khác
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="ct-row">
                                        <div className="ct-group">
                                            <label className="ct-label">Họ và tên <span>*</span></label>
                                            <input
                                                type="text" name="name"
                                                className="ct-input"
                                                placeholder="Nguyễn Văn A"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="ct-group">
                                            <label className="ct-label">Số điện thoại</label>
                                            <input
                                                type="tel" name="phone"
                                                className="ct-input"
                                                placeholder="0909 123 456"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="ct-group">
                                        <label className="ct-label">Email <span>*</span></label>
                                        <input
                                            type="email" name="email"
                                            className="ct-input"
                                            placeholder="example@gmail.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="ct-group">
                                        <label className="ct-label">Tin nhắn <span>*</span></label>
                                        <textarea
                                            name="message"
                                            className="ct-input"
                                            rows="5"
                                            placeholder="Bạn cần hỗ trợ gì? Đặt bánh số lượng lớn, hỏi về sản phẩm..."
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="ct-btn">
                                        Gửi tin nhắn →
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}

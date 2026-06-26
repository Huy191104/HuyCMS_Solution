import { Link } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import "../assets/css/Footer.css";

function Footer() {
    return (
        <footer className="bh-footer">

            {/* Top */}
            <div className="bh-footer-top">
                <div className="bh-footer-inner">

                    {/* Brand */}
                    <div className="bh-footer-brand">
                        <Link to="/" className="bh-footer-logo">
                            <img src={logoImg} alt="Bakery House Logo" className="bh-footer-logo-img" />
                            <div>
                                <div className="bh-footer-logo-name">Bakery House</div>
                                <div className="bh-footer-logo-tag">Thủ công · Tươi mỗi ngày</div>
                            </div>
                        </Link>
                        <p className="bh-footer-about">
                            Chuyên cung cấp bánh sinh nhật, bánh kem tươi, tiramisu
                            và các loại bánh ngọt thủ công cao cấp — làm mới mỗi sáng.
                        </p>
                        <div className="bh-footer-socials">
                            <a href="#" className="bh-social" title="Facebook">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="#" className="bh-social" title="Instagram">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                </svg>
                            </a>
                            <a href="#" className="bh-social" title="TikTok">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="bh-footer-col">
                        <div className="bh-footer-col-title">Khám phá</div>
                        <Link to="/" className="bh-footer-link">Trang chủ</Link>
                        <Link to="/products" className="bh-footer-link">Sản phẩm</Link>
                        <Link to="/posts" className="bh-footer-link">Tin tức</Link>
                        <Link to="/about" className="bh-footer-link">Giới thiệu</Link>
                    </div>

                    {/* Contact */}
                    <div className="bh-footer-col">
                        <div className="bh-footer-col-title">Liên hệ</div>
                        <div className="bh-footer-contact-item">
                            <span>📍</span> TP. Hồ Chí Minh
                        </div>
                        <div className="bh-footer-contact-item">
                            <span>📞</span> 0909 123 456
                        </div>
                        <div className="bh-footer-contact-item">
                            <span>✉️</span> support@bakeryhouse.vn
                        </div>
                        <div className="bh-footer-contact-item">
                            <span>🕐</span> T2–T7: 07:00 – 21:00
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="bh-footer-col">
                        <div className="bh-footer-col-title">Nhận ưu đãi</div>
                        <p className="bh-footer-newsletter-desc">
                            Đăng ký nhận thông báo về bánh mới và khuyến mãi hàng tuần.
                        </p>
                        <div className="bh-newsletter-form">
                            <input
                                type="email"
                                placeholder="Email của bạn..."
                                className="bh-newsletter-input"
                            />
                            <button className="bh-newsletter-btn">→</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom */}
            <div className="bh-footer-bottom">
                <div className="bh-footer-inner bh-footer-bottom-inner">
                    <span>© 2026 Bakery House. All Rights Reserved.</span>
                    <div className="bh-footer-bottom-links">
                        <Link to="/privacy">Chính sách bảo mật</Link>
                        <Link to="/terms">Điều khoản sử dụng</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}

export default Footer;

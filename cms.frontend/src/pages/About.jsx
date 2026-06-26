import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import "../assets/css/About.css";

const VALUES = [
    { icon: "🌾", title: "Nguyên liệu tự nhiên", desc: "Chọn lọc kỹ từ nguồn cung cấp uy tín, không chất bảo quản, an toàn cho sức khỏe." },
    { icon: "👨‍🍳", title: "Thủ công mỗi ngày", desc: "Từng chiếc bánh được làm thủ công bởi nghệ nhân với hơn 10 năm kinh nghiệm." },
    { icon: "❤️", title: "Tình yêu vào bánh", desc: "Mỗi chiếc bánh là một tác phẩm, được tạo ra với tất cả tâm huyết và sự chỉn chu." },
    { icon: "🚀", title: "Giao hàng tận nơi", desc: "Giao hàng trong ngày, đảm bảo bánh đến tay bạn còn tươi ngon và đẹp mắt nhất." },
];

const TEAM = [
    { name: "Nguyễn Minh Tú", role: "Bếp trưởng & Sáng lập", emoji: "👨‍🍳" },
    { name: "Trần Thị Lan Anh", role: "Chuyên gia bánh Pháp", emoji: "👩‍🍳" },
    { name: "Lê Hoàng Nam", role: "Nghệ nhân bánh kem", emoji: "🎂" },
];

const MILESTONES = [
    { year: "2018", title: "Khởi đầu", desc: "Bakery House ra đời từ một căn bếp nhỏ với niềm đam mê bánh ngọt." },
    { year: "2020", title: "Mở rộng", desc: "Khai trương cửa hàng đầu tiên tại TP. Hồ Chí Minh." },
    { year: "2022", title: "Phát triển", desc: "Ra mắt nền tảng đặt bánh online, phục vụ hơn 1000 khách/tháng." },
    { year: "2024", title: "Công nhận", desc: "Đạt giải Top 10 tiệm bánh được yêu thích nhất TP.HCM." },
];

export default function About() {
    return (
        <>
            <Header />

            {/* Hero */}
            <div className="ab-hero">
                <div className="ab-hero-bg" />
                <div className="ab-hero-inner">
                    <div className="ab-hero-eyebrow">Về chúng tôi</div>
                    <h1 className="ab-hero-title">Câu chuyện <em>Bakery House</em></h1>
                    <p className="ab-hero-sub">
                        Từ niềm đam mê với bánh ngọt, chúng tôi mang đến những chiếc bánh
                        thủ công tươi ngon mỗi ngày
                    </p>
                </div>
            </div>

            {/* Story */}
            <section className="ab-section">
                <div className="ab-container">
                    <div className="ab-story">
                        <div className="ab-story-text">
                            <div className="ab-eyebrow">Câu chuyện của chúng tôi</div>
                            <h2 className="ab-title">Từ căn bếp nhỏ <em>đến trái tim</em> của thành phố</h2>
                            <p className="ab-desc">
                                Bakery House được thành lập năm 2018 bởi những người yêu bánh với mong muốn
                                mang đến những chiếc bánh thủ công chất lượng cao, được làm từ nguyên liệu
                                tự nhiên tươi ngon nhất.
                            </p>
                            <p className="ab-desc">
                                Chúng tôi tin rằng mỗi chiếc bánh không chỉ là món ăn — mà là kỷ niệm,
                                là tình yêu, là niềm vui được chia sẻ. Từ những chiếc bánh sinh nhật đến
                                croissant buổi sáng, tất cả đều được làm với tất cả tâm huyết.
                            </p>
                            <div className="ab-stats">
                                <div className="ab-stat">
                                    <div className="ab-stat-num">5+</div>
                                    <div className="ab-stat-label">Năm kinh nghiệm</div>
                                </div>
                                <div className="ab-stat">
                                    <div className="ab-stat-num">200+</div>
                                    <div className="ab-stat-label">Loại bánh</div>
                                </div>
                                <div className="ab-stat">
                                    <div className="ab-stat-num">5k+</div>
                                    <div className="ab-stat-label">Khách hàng</div>
                                </div>
                            </div>
                        </div>
                        <div className="ab-story-visual">
                            <div className="ab-story-img">
                                <img src={logoImg} alt="Bakery House Logo" className="ab-story-logo-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="ab-values-section">
                <div className="ab-container">
                    <div className="ab-section-header">
                        <div className="ab-eyebrow">Giá trị cốt lõi</div>
                        <h2 className="ab-title">Điều làm chúng tôi <em>khác biệt</em></h2>
                    </div>
                    <div className="ab-values-grid">
                        {VALUES.map((v, i) => (
                            <div className="ab-value-card" key={i}>
                                <div className="ab-value-icon">{v.icon}</div>
                                <div className="ab-value-title">{v.title}</div>
                                <p className="ab-value-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="ab-section">
                <div className="ab-container">
                    <div className="ab-section-header">
                        <div className="ab-eyebrow">Hành trình</div>
                        <h2 className="ab-title">Những <em>cột mốc</em> đáng nhớ</h2>
                    </div>
                    <div className="ab-timeline">
                        {MILESTONES.map((m, i) => (
                            <div className="ab-milestone" key={i}>
                                <div className="ab-milestone-year">{m.year}</div>
                                <div className="ab-milestone-dot" />
                                <div className="ab-milestone-content">
                                    <div className="ab-milestone-title">{m.title}</div>
                                    <div className="ab-milestone-desc">{m.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="ab-team-section">
                <div className="ab-container">
                    <div className="ab-section-header">
                        <div className="ab-eyebrow">Đội ngũ</div>
                        <h2 className="ab-title">Những <em>nghệ nhân</em> tài ba</h2>
                    </div>
                    <div className="ab-team-grid">
                        {TEAM.map((t, i) => (
                            <div className="ab-team-card" key={i}>
                                <div className="ab-team-avatar">{t.emoji}</div>
                                <div className="ab-team-name">{t.name}</div>
                                <div className="ab-team-role">{t.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="ab-cta">
                <div className="ab-cta-bg" />
                <div className="ab-cta-inner">
                    <h2 className="ab-cta-title">Sẵn sàng thưởng thức <em>bánh ngon</em>?</h2>
                    <p className="ab-cta-sub">Khám phá hơn 200 loại bánh thủ công của chúng tôi</p>
                    <Link to="/products" className="ab-cta-btn">Xem sản phẩm →</Link>
                </div>
            </section>

            <Footer />
        </>
    );
}

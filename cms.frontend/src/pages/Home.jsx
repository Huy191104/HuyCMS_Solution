import "../assets/css/HomeView.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logoImg from "../assets/images/logo.png";
import ProductList from "../components/ProductList";
import PostList from "../components/PostList";
import CategoryProductList from "../components/CategoryProductList";
import bannerService from "../services/bannerService";
import { IMAGE_BASE_URL } from '../api/config';

const API_BASE = IMAGE_BASE_URL;

/* ── useFadeUp hook ───────────────────────── */
function useFadeUp() {
    useEffect(() => {
        const els = document.querySelectorAll(".bh-fade-up");
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add("visible");
            }),
            { threshold: 0.12 }
        );
        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);
}

/* ── Testimonials data ────────────────────── */
const TESTIMONIALS = [
    { text: "Tiramisu ở đây mềm và thơm hơn bất kỳ tiệm nào tôi từng thử. Trở thành khách quen từ lần đầu ghé thăm!", author: "Nguyễn Minh Châu" },
    { text: "Bánh sinh nhật tôi order thật sự đẹp và ngon vượt mong đợi. Cả gia đình đều khen. Sẽ quay lại!", author: "Trần Thảo Vy" },
    { text: "Giao hàng nhanh, bánh vẫn còn ấm và tươi. Đóng gói cẩn thận. Dịch vụ rất chuyên nghiệp.", author: "Lê Đức Minh" },
];
        
const PROMISES = [
    { icon: "🌾", title: "Nguyên liệu tươi", desc: "Chọn lọc kỹ từ nguồn cung cấp uy tín, không chất bảo quản" },
    { icon: "👨‍🍳", title: "Thủ công mỗi ngày", desc: "Nghệ nhân bánh với hơn 10 năm kinh nghiệm" },
    { icon: "🚀", title: "Giao hàng nhanh", desc: "Giao trong ngày, đảm bảo bánh còn tươi ngon nhất" },
    { icon: "💝", title: "Đặt theo yêu cầu", desc: "Tuỳ chỉnh hình dáng, hương vị cho mọi dịp đặc biệt" },
];

/* ── Home Component ───────────────────────── */
function Home() {
    useFadeUp();

    const [banners, setBanners] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await bannerService.getActiveBanners();
                setBanners(data);
            } catch (e) {
                console.error("Lỗi lấy danh sách banner:", e);
            }
        };
        fetchBanners();
    }, []);

    // Tự động chuyển slide sau 5 giây
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    return (
        <>
            <Header />

            {/* ══ HERO ══════════════════════════════ */}
            <section className="bh-hero">
                <div className="bh-hero-bg" />
                <div className="bh-hero-grain" />
                <div className="bh-hero-circle" />

                <div className="bh-hero-inner">
                    {/* Left */}
                    <div>
                        <div className="bh-hero-eyebrow">Tiệm bánh thủ công</div>

                        <h1 className="bh-hero-title">
                            Ngọt ngào<br />
                            trong từng<br />
                            <em>khoảnh khắc</em>
                        </h1>

                        <p className="bh-hero-desc">
                            Bánh tươi làm thủ công mỗi ngày — từ nguyên liệu tự nhiên,
                            gửi gắm tình yêu vào từng chiếc bánh.
                        </p>

                        <div className="bh-hero-actions">
                            <Link to="/products" className="bh-btn-primary">Khám phá ngay →</Link>
                            <Link to="/posts" className="bh-btn-ghost">Cẩm nang bánh ngọt</Link>
                        </div>

                        <div className="bh-hero-stats">
                            <div><div className="bh-stat-num">200+</div><div className="bh-stat-label">Loại bánh</div></div>
                            <div><div className="bh-stat-num">4.9★</div><div className="bh-stat-label">Đánh giá</div></div>
                            <div><div className="bh-stat-num">5k+</div> <div className="bh-stat-label">Khách hàng</div></div>
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="bh-hero-visual">
                        <div className="bh-hero-img-wrap">
                            <div className="bh-hero-img-placeholder">
                                <img src={logoImg} alt="Bakery House Logo" className="bh-hero-logo-img" />
                                <p>BAKERY HOUSE</p>
                            </div>
                        </div>
                        <div className="bh-float-badge left">
                            <div className="bh-float-icon">🎂</div>
                            <div>
                                <div className="bh-float-title">Làm mới mỗi ngày</div>
                                <div className="bh-float-sub">Giao trước 8:00 sáng</div>
                            </div>
                        </div>
                        <div className="bh-float-badge top">
                            <div className="bh-float-icon">🌿</div>
                            <div>
                                <div className="bh-float-title">100% tự nhiên</div>
                                <div className="bh-float-sub">Không chất bảo quản</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PROMISE ═══════════════════════════ */}
            <section className="bh-promise">
                <div className="bh-promise-inner">
                    {PROMISES.map((p, i) => (
                        <div className="bh-promise-item bh-fade-up" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                            <span className="bh-promise-icon">{p.icon}</span>
                            <div className="bh-promise-title">{p.title}</div>
                            <p className="bh-promise-desc">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ DYNAMIC BANNER SLIDER ═══════════════ */}
            {banners.length > 0 && (
                <section className="home-slider">
                    <div className="slider-container">
                        <div className="slider-wrapper" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                            {banners.map((b) => (
                                b.linkUrl ? (
                                    <Link key={b.id} to={b.linkUrl} className="slider-slide" style={{ backgroundImage: `url(${API_BASE}${b.imageUrl})` }} />
                                ) : (
                                    <div key={b.id} className="slider-slide" style={{ backgroundImage: `url(${API_BASE}${b.imageUrl})` }} />
                                )
                            ))}
                        </div>
                        {banners.length > 1 && (
                            <>
                                <button className="slider-arrow prev" onClick={() => setActiveSlide((prev) => (prev - 1 + banners.length) % banners.length)}>‹</button>
                                <button className="slider-arrow next" onClick={() => setActiveSlide((prev) => (prev + 1) % banners.length)}>›</button>
                                <div className="slider-dots">
                                    {banners.map((_, idx) => (
                                        <span key={idx} className={`slider-dot ${idx === activeSlide ? "active" : ""}`} onClick={() => setActiveSlide(idx)} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* ══ CATEGORY ══════════════════════════ */}
            <section className="bh-cat-section">
                <div className="bh-section" style={{ padding: "0 48px" }}>
                    <div className="bh-section-header">
                        <div className="bh-fade-up">
                            <div className="bh-section-eyebrow">Danh mục</div>
                            <h2 className="bh-section-title">Tìm bánh theo <em>sở thích</em></h2>
                        </div>
                    </div>
                    <div className="bh-fade-up"><CategoryProductList /></div>
                </div>
            </section>

            {/* ══ PRODUCTS ══════════════════════════ */}
            {/* Mới nhất */}
            <section style={{ background: "var(--cream)" }}>
                <div className="bh-section">
                    <div className="bh-section-header">
                        <div className="bh-fade-up">
                            <div className="bh-section-eyebrow">Mới nhất</div>
                            <h2 className="bh-section-title">Vừa ra <em>lò hôm nay</em></h2>
                            <p className="bh-section-sub">Những chiếc bánh tươi nhất vừa được làm xong</p>
                        </div>
                        <Link to="/products?mode=newest" className="bh-link-all bh-fade-up">Xem tất cả →</Link>
                    </div>
                    <div className="bh-fade-up">
                        <ProductList mode="newest" take={4} />
                    </div>
                </div>
            </section>

            {/* Bán chạy */}
            <section style={{ background: "var(--cream-deep)" }}>
                <div className="bh-section">
                    <div className="bh-section-header">
                        <div className="bh-fade-up">
                            <div className="bh-section-eyebrow">Bán chạy nhất</div>
                            <h2 className="bh-section-title">Được yêu thích <em>nhất tuần</em></h2>
                            <p className="bh-section-sub">Những chiếc bánh khách hàng đặt nhiều nhất</p>
                        </div>
                        <Link to="/products?mode=bestseller" className="bh-link-all bh-fade-up">Xem tất cả →</Link>
                    </div>
                    <div className="bh-fade-up">
                        <ProductList mode="bestseller" take={4} />
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ══════════════════════ */}
            <section className="bh-testi-section">
                <div className="bh-testi-inner">
                    <div className="bh-fade-up">
                        <div className="bh-section-eyebrow">Khách hàng nói gì</div>
                        <h2 className="bh-section-title">Câu chuyện từ <em>khách hàng</em></h2>
                    </div>
                    <div className="bh-testi-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div className="bh-testi-card bh-fade-up" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
                                <div className="bh-testi-stars">★★★★★</div>
                                <p className="bh-testi-text">"{t.text}"</p>
                                <div className="bh-testi-author">— {t.author}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ POSTS ═════════════════════════════ */}
            <section style={{ background: "var(--cream)" }}>
                <div className="bh-section">
                    <div className="bh-section-header">
                        <div className="bh-fade-up">
                            <div className="bh-section-eyebrow">Cẩm nang</div>
                            <h2 className="bh-section-title">Tin tức & <em>bánh ngọt</em></h2>
                            <p className="bh-section-sub">Bí quyết, công thức và câu chuyện từ bếp bánh của chúng tôi</p>
                        </div>
                        <Link to="/posts" className="bh-link-all bh-fade-up">Xem tất cả →</Link>
                    </div>
                    <div className="bh-fade-up"><PostList /></div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Home;

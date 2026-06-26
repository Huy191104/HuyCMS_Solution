import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../services/authService";
import logoImg from "../assets/images/logo.png";
import "../assets/css/Header.css";

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("/");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Đọc từ URL khi khởi tạo hoặc URL thay đổi
    const getQueryParam = () => {
        const params = new URLSearchParams(location.search);
        return location.pathname === "/search" ? params.get("q") || "" : "";
    };

    const [searchQuery, setSearchQuery] = useState(getQueryParam());

    useEffect(() => {
        setSearchQuery(getQueryParam());
    }, [location]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/products");
        }
    };

    useEffect(() => {
        setActive(window.location.pathname);
        setUser(authService.getCurrentUser());

        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);

        // Đóng dropdown khi click ra ngoài
        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);

        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((sum, i) => sum + i.quantity, 0);
            setCartCount(count);
        };
        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);

        const updateUserInfo = () => {
            setUser(authService.getCurrentUser());
        };
        window.addEventListener("userUpdated", updateUserInfo);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("userUpdated", updateUserInfo);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setDropdownOpen(false);
        window.location.href = "/";
    };


    // Lấy chữ cái đầu của tên để làm avatar
    const getInitials = (name = "") => {
        return name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
    };

    const links = [
        { label: "Trang chủ", href: "/" },
        { label: "Sản phẩm", href: "/products" },
        { label: "Tin tức", href: "/posts" },
        { label: "Giới thiệu", href: "/about" },
        { label: "Liên hệ", href: "/contact" },
    ];

    return (
        <header className={`bh-header ${scrolled ? "bh-header--scrolled" : ""}`}>
            <div className="bh-header-inner">

                {/* Logo */}
                <Link to="/" className="bh-logo">
                    <img src={logoImg} alt="Bakery House Logo" className="bh-logo-img" />
                    <div>
                        <div className="bh-logo-name">Bakery House</div>
                        <div className="bh-logo-tagline">Thủ công · Tươi mỗi ngày</div>
                    </div>
                </Link>

                {/* Thanh tìm kiếm desktop */}
                <form className="bh-search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Tìm bánh ngon..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bh-search-input"
                    />
                    <span className="bh-search-icon" onClick={handleSearchSubmit} style={{ cursor: "pointer" }}>🔍</span>
                </form>

                {/* Nav desktop */}
                <nav className="bh-nav">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            to={l.href}
                            className={`bh-nav-link ${active === l.href ? "bh-nav-link--active" : ""}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="bh-header-actions">

                    {/* Giỏ hàng */}
                    <Link to="/cart" className="bh-cart-btn" title="Giỏ hàng">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="bh-cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                        )}
                    </Link>

                    {/* Chưa đăng nhập */}
                    {!user ? (
                        <Link to="/login" className="bh-login-btn">Đăng nhập</Link>
                    ) : (
                        /* Đã đăng nhập — User dropdown */
                        <div className="bh-user-wrap" ref={dropdownRef}>
                            <button
                                className="bh-user-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="bh-user-avatar">
                                    {getInitials(user.fullName)}
                                </div>
                                <span className="bh-user-name">
                                    {user.fullName.split(" ").slice(-1)[0]}
                                </span>
                                <span className={`bh-chevron ${dropdownOpen ? "bh-chevron--open" : ""}`}>▾</span>
                            </button>

                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div className="bh-dropdown">
                                    <div className="bh-dropdown-header">
                                        <div className="bh-dropdown-name">{user.fullName}</div>
                                        <div className="bh-dropdown-email">{user.email}</div>
                                    </div>
                                    <div className="bh-dropdown-divider" />
                                    <Link to="/profile" className="bh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        👤 Thông tin tài khoản
                                    </Link>
                                    <Link to="/orders" className="bh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        📦 Đơn hàng của tôi
                                    </Link>
                                    <div className="bh-dropdown-divider" />
                                    <button className="bh-dropdown-item bh-dropdown-logout" onClick={handleLogout}>
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Hamburger */}
                <button
                    className={`bh-hamburger ${menuOpen ? "bh-hamburger--open" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Menu"
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`bh-mobile-menu ${menuOpen ? "bh-mobile-menu--open" : ""}`}>
                {/* Tìm kiếm mobile */}
                <form className="bh-mobile-search-form" onSubmit={handleSearchSubmit} style={{ marginBottom: "12px" }}>
                    <input
                        type="text"
                        placeholder="Tìm bánh ngon..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bh-mobile-search-input"
                    />
                </form>
                {links.map((l) => (
                    <Link
                        key={l.href}
                        to={l.href}
                        className={`bh-mobile-link ${active === l.href ? "bh-mobile-link--active" : ""}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {l.label}
                    </Link>
                ))}
                <div className="bh-dropdown-divider" style={{ margin: "8px 0" }} />
                {!user ? (
                    <Link to="/login" className="bh-mobile-login">Đăng nhập</Link>
                ) : (
                    <>
                        <div className="bh-mobile-user-info">
                            <div className="bh-user-avatar" style={{ margin: "0 auto 8px" }}>
                                {getInitials(user.fullName)}
                            </div>
                            <div style={{ color: "#F5E6C8", fontSize: "13px", fontWeight: 500 }}>{user.fullName}</div>
                            <div style={{ color: "rgba(245,230,200,0.45)", fontSize: "11px" }}>{user.email}</div>
                        </div>
                        <Link to="/profile" className="bh-mobile-link" onClick={() => setMenuOpen(false)}>👤 Tài khoản</Link>
                        <Link to="/orders" className="bh-mobile-link" onClick={() => setMenuOpen(false)}>📦 Đơn hàng</Link>
                        <button className="bh-mobile-login" style={{ background: "rgba(255,255,255,0.08)", marginTop: 8 }} onClick={handleLogout}>
                            🚪 Đăng xuất
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;

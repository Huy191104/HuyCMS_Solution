import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import categoryProductService from "../services/categoryProductService";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Product.css";

const API_BASE = "https://localhost:7290";
const formatVND = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

export default function Product() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category");

    // Filters
    const [search, setSearch] = useState("");
    const [activeCat, setActiveCat] = useState(null);
    const [sort, setSort] = useState("default");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [prod, cats] = await Promise.all([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts(),
                ]);

                setProducts(prod);
                setCategories(cats);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (categoryId) {
            setActiveCat(Number(categoryId));
        }
    }, [categoryId]);

    // Filter + sort logic
    const filtered = products
        .filter((p) => {

            const matchCat = activeCat
                ? p.categoryProductId === activeCat
                : true;

            const matchSearch = p.name
                .toLowerCase()
                .includes(search.toLowerCase());

            return matchCat && matchSearch;
        })
        .sort((a, b) => {
            if (sort === "price-asc") return a.price - b.price;
            if (sort === "price-desc") return b.price - a.price;
            if (sort === "newest") return b.id - a.id;
            return 0;
        });

    return (
        <>
            <Header />

            {/* ── Page hero ── */}
            <div className="prd-hero">
                <div className="prd-hero-bg" />
                <div className="prd-hero-inner">
                    <div className="prd-hero-eyebrow">Cửa hàng</div>
                    <h1 className="prd-hero-title">Tất cả <em>sản phẩm</em></h1>
                    <p className="prd-hero-sub">Bánh tươi làm thủ công mỗi ngày — chọn chiếc bánh yêu thích của bạn</p>
                </div>
            </div>

            <div className="prd-page">

                {/* ── Sidebar filter ── */}
                <aside className="prd-sidebar">
                    <div className="prd-sidebar-card">
                        <div className="prd-sidebar-title">Tìm kiếm</div>
                        <div className="prd-search-box">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Tên sản phẩm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="prd-sidebar-card">
                        <div className="prd-sidebar-title">Danh mục</div>
                        <button
                            className={`prd-cat-btn ${activeCat === null ? "active" : ""}`}
                            onClick={() => setActiveCat(null)}
                        >
                            <span>🍞</span> Tất cả
                        </button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                className={`prd-cat-btn ${activeCat === c.id ? "active" : ""}`}
                                onClick={() => setActiveCat(c.id)}
                            >
                                <span>{getCatIcon(c.name)}</span> {c.name}
                            </button>
                        ))}
                    </div>

                    <div className="prd-sidebar-card">
                        <div className="prd-sidebar-title">Sắp xếp</div>
                        {[
                            { value: "default", label: "Mặc định" },
                            { value: "newest", label: "Mới nhất" },
                            { value: "price-asc", label: "Giá tăng dần" },
                            { value: "price-desc", label: "Giá giảm dần" },
                        ].map((s) => (
                            <button
                                key={s.value}
                                className={`prd-cat-btn ${sort === s.value ? "active" : ""}`}
                                onClick={() => setSort(s.value)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Product grid ── */}
                <main className="prd-main">
                    <div className="prd-toolbar">
                        <div className="prd-count">
                            {loading ? "Đang tải..." : `${filtered.length} sản phẩm`}
                        </div>
                    </div>

                    {loading ? (
                        <div className="prd-grid">
                            {[...Array(8)].map((_, i) => (
                                <div className="prd-skeleton" key={i}>
                                    <div className="prd-skeleton-img" />
                                    <div className="prd-skeleton-body">
                                        <div className="prd-skeleton-line" style={{ width: "70%" }} />
                                        <div className="prd-skeleton-line" style={{ width: "45%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="prd-empty">
                            <span>🔍</span>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                            <button onClick={() => { setSearch(""); setActiveCat(null); }}>
                                Xoá bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div className="prd-grid">
                            {filtered.map((item) => (
                                <div
                                    className="prd-card"
                                    key={item.id}
                                    onClick={() => navigate(`/products/${item.id}`)}
                                >
                                    <div className="prd-card-img-wrap">
                                        {item.imageUrl ? (
                                            <img src={`${API_BASE}${item.imageUrl}`} alt={item.name} />
                                        ) : (
                                            <div className="prd-card-img-placeholder">🍞</div>
                                        )}
                                        {item.stockQuantity === 0 && (
                                            <div className="prd-badge prd-badge--out">Hết hàng</div>
                                        )}
                                        {item.stockQuantity > 0 && item.stockQuantity <= 5 && (
                                            <div className="prd-badge prd-badge--low">Sắp hết</div>
                                        )}
                                    </div>
                                    <div className="prd-card-body">
                                        <div className="prd-card-name">{item.name}</div>
                                        <div className="prd-card-price">{formatVND(item.price)}</div>
                                        <div className="prd-card-stock">
                                            <span className={item.stockQuantity > 0 ? "dot-in" : "dot-out"} />
                                            {item.stockQuantity > 0 ? `Còn ${item.stockQuantity}` : "Tạm hết"}
                                        </div>
                                    </div>
                                    <div className="prd-card-footer">
                                        <button
                                            className="prd-card-btn"
                                            disabled={item.stockQuantity === 0}
                                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${item.id}`); }}
                                        >
                                            Xem chi tiết →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </>
    );
}

function getCatIcon(name = "") {
    const n = name.toLowerCase();
    if (n.includes("combo") || n.includes("tiệc")) return "🎉";
    if (n.includes("cheesecake")) return "🍰";
    if (n.includes("cookies") || n.includes("quy")) return "🍪";
    if (n.includes("cupcake")) return "🧁";
    if (n.includes("tiramisu")) return "☕";
    if (n.includes("mousse")) return "🍮";
    if (n.includes("kem tươi") || n.includes("kem")) return "🍦";
    if (n.includes("sinh nhật")) return "🎂";
    return "🍞";
}

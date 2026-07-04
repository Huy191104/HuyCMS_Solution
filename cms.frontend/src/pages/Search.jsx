import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/ProductList.css";
import { IMAGE_BASE_URL } from "../api/config";

const API_BASE = IMAGE_BASE_URL;
const formatVND = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function Search() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedProductId, setAddedProductId] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!q.trim()) {
                setProducts([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await productService.searchProducts(q);
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [q]);

    const handleAddToCart = (product) => {
        if (!product) return;

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((i) => i.id === product.id);
        const currentInCart = existing ? existing.quantity : 0;
        const totalRequested = currentInCart + 1;

        if (totalRequested > product.stockQuantity) {
            alert(`Không thể thêm! Số lượng sản phẩm này trong giỏ hàng đã đạt giới hạn tồn kho (${product.stockQuantity} sản phẩm).`);
            return;
        }

        if (existing) {
            existing.quantity = totalRequested;
            existing.stockQuantity = product.stockQuantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1,
                stockQuantity: product.stockQuantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        setAddedProductId(product.id);
        setTimeout(() => setAddedProductId(null), 2000);
    };

    return (
        <>
            <Header />
            
            {/* Search Hero */}
            <div style={{
                background: "linear-gradient(135deg, #2C1A0E 0%, #1E0E00 100%)",
                padding: "100px 24px 60px",
                textAlign: "center",
                color: "#F5E6C8"
            }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent, #C17A3A)", marginBottom: "8px" }}>Kết quả tìm kiếm</div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", margin: "0 0 12px" }}>Từ khóa: "<em>{q}</em>"</h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(245,230,200,0.65)" }}>
                    Tìm thấy {products.length} sản phẩm phù hợp
                </p>
            </div>

            {/* Main Content */}
            <main style={{ minHeight: "60vh", background: "var(--cream, #FAF7F2)", padding: "48px 24px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {loading ? (
                        <div className="pl-grid">
                            {[...Array(4)].map((_, i) => (
                                <div className="pl-skeleton" key={i}>
                                    <div className="pl-skeleton-img" />
                                    <div className="pl-skeleton-body">
                                        <div className="pl-skeleton-line" style={{ width: "70%" }} />
                                        <div className="pl-skeleton-line" style={{ width: "45%" }} />
                                        <div className="pl-skeleton-line" style={{ width: "55%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 0" }}>
                            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔍</span>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#1E0E00", marginBottom: "8px" }}>Không tìm thấy sản phẩm nào</h2>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#8C7355", marginBottom: "24px" }}>Bạn vui lòng thử lại với từ khóa khác.</p>
                            <button 
                                onClick={() => navigate("/products")}
                                style={{
                                    background: "var(--accent, #C17A3A)",
                                    color: "#FFF8EE",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px 24px",
                                    cursor: "pointer",
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 500
                                }}
                            >
                                Xem tất cả sản phẩm
                            </button>
                        </div>
                    ) : (
                        <div className="pl-grid">
                            {products.map((item) => (
                                <div
                                    className="pl-card"
                                    key={item.id}
                                    onClick={() => navigate(`/products/${item.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {/* Image */}
                                    <div className="pl-img-wrap">
                                        {item.imageUrl ? (
                                            <img
                                                src={`${API_BASE}${item.imageUrl}`}
                                                alt={item.name}
                                                className="pl-img"
                                            />
                                        ) : (
                                            <div className="pl-img-placeholder">🍞</div>
                                        )}
                                        {/* Stock badge */}
                                        {item.stockQuantity <= 5 && item.stockQuantity > 0 && (
                                            <div className="pl-badge pl-badge--low">Sắp hết</div>
                                        )}
                                        {item.stockQuantity === 0 && (
                                            <div className="pl-badge pl-badge--out">Hết hàng</div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="pl-body">
                                        <div className="pl-name">{item.name}</div>
                                        <div className="pl-price">{formatVND(item.price)}</div>
                                        <div className="pl-stock">
                                            <span className={item.stockQuantity > 0 ? "pl-stock-dot--in" : "pl-stock-dot--out"} />
                                            {item.stockQuantity > 0
                                                ? `Còn ${item.stockQuantity} sản phẩm`
                                                : "Tạm hết hàng"}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pl-footer">
                                        <button
                                            className="pl-btn-detail"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/products/${item.id}`);
                                            }}
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className={`pl-btn-add ${addedProductId === item.id ? "pl-btn-add--added" : ""}`}
                                            disabled={item.stockQuantity === 0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(item);
                                            }}
                                        >
                                            {item.stockQuantity === 0
                                                ? "Hết hàng"
                                                : addedProductId === item.id
                                                    ? "✓ Đã thêm"
                                                    : "Thêm ngay"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}

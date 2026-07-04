import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productService from "../services/productService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/ProductDetail.css";
import { IMAGE_BASE_URL } from "../api/config";

const API_BASE = IMAGE_BASE_URL;
const formatVND = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
const preprocessDescription = (desc) => {
    if (!desc) return "";
    return desc
        .replace(/src="\/uploads\//g, `src="${API_BASE}/uploads/`)
        .replace(/src='\/uploads\//g, `src='${API_BASE}/uploads/`);
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        // Lấy cart từ localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find((i) => i.id === product.id);
        const currentInCart = existing ? existing.quantity : 0;
        const totalRequested = currentInCart + quantity;

        if (totalRequested > product.stockQuantity) {
            alert(`Không thể thêm! Số lượng trong giỏ hàng hiện tại (${currentInCart}) cộng với số lượng muốn thêm (${quantity}) vượt quá tồn kho hiện có (${product.stockQuantity} sản phẩm).`);
            return;
        }

        if (existing) {
            existing.quantity = totalRequested;
            existing.stockQuantity = product.stockQuantity; // Cập nhật lại tồn kho mới nhất
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity,
                stockQuantity: product.stockQuantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="pd-loading">
                    <div className="pd-loading-img" />
                    <div className="pd-loading-info">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="pd-loading-line" style={{ width: `${70 - i * 12}%` }} />
                        ))}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="pd-notfound">
                    <span>🍰</span>
                    <h2>Không tìm thấy sản phẩm</h2>
                    <button onClick={() => navigate("/products")}>← Quay lại cửa hàng</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="pd-page">

                {/* Breadcrumb */}
                <div className="pd-breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>›</span>
                    <Link to="/products">Sản phẩm</Link>
                    <span>›</span>
                    <span>{product.name}</span>
                </div>

                {/* Main layout */}
                <div className="pd-layout">

                    {/* ── Image ── */}
                    <div className="pd-img-col">
                        <div className="pd-img-wrap">
                            {product.imageUrl ? (
                                <img
                                    src={`${API_BASE}${product.imageUrl}`}
                                    alt={product.name}
                                    className="pd-img"
                                />
                            ) : (
                                <div className="pd-img-placeholder">🍞</div>
                            )}
                            {product.stockQuantity === 0 && (
                                <div className="pd-out-overlay">Tạm hết hàng</div>
                            )}
                        </div>
                    </div>

                    {/* ── Info ── */}
                    <div className="pd-info-col">

                        {/* Category badge */}
                        {product.categoryProduct && (
                            <div className="pd-cat-badge">
                                {product.categoryProduct.name}
                            </div>
                        )}

                        <h1 className="pd-name">{product.name}</h1>

                        <div className="pd-price">{formatVND(product.price)}</div>

                        {/* Stock */}
                        <div className="pd-stock">
                            <span className={product.stockQuantity > 0 ? "pd-dot-in" : "pd-dot-out"} />
                            {product.stockQuantity > 0
                                ? `Còn ${product.stockQuantity} sản phẩm`
                                : "Tạm hết hàng"}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="pd-desc ck-content" dangerouslySetInnerHTML={{ __html: preprocessDescription(product.description) }} />
                        )}

                        <div className="pd-divider" />

                        {/* Quantity */}
                        {product.stockQuantity > 0 && (
                            <>
                                <div className="pd-qty-label">Số lượng</div>
                                <div className="pd-qty-wrap">
                                    <button
                                        className="pd-qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >−</button>
                                    <span className="pd-qty-val">{quantity}</span>
                                    <button
                                        className="pd-qty-btn"
                                        onClick={() => {
                                            if (quantity >= product.stockQuantity) {
                                                alert(`Xin lỗi, chỉ còn tối đa ${product.stockQuantity} sản phẩm trong kho.`);
                                            } else {
                                                setQuantity(quantity + 1);
                                            }
                                        }}
                                    >+</button>
                                </div>

                                {/* Total */}
                                <div className="pd-total">
                                    Tạm tính: <strong>{formatVND(product.price * quantity)}</strong>
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className="pd-actions">
                            <button
                                className={`pd-btn-cart ${added ? "pd-btn-cart--added" : ""}`}
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0}
                            >
                                {added ? "✓ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ hàng"}
                            </button>
                            <button
                                className="pd-btn-back"
                                onClick={() => navigate("/products")}
                            >
                                ← Tiếp tục mua sắm
                            </button>
                        </div>

                        {/* Promises */}
                        <div className="pd-promises">
                            {[
                                { icon: "🌿", text: "Nguyên liệu tự nhiên, không chất bảo quản" },
                                { icon: "👨‍🍳", text: "Làm thủ công mỗi ngày" },
                                { icon: "🚀", text: "Giao hàng trong ngày" },
                            ].map((p, i) => (
                                <div className="pd-promise-item" key={i}>
                                    <span>{p.icon}</span>
                                    <span>{p.text}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

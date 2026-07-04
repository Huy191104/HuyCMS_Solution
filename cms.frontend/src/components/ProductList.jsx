import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { useNavigate } from "react-router-dom";
import "../assets/css/ProductList.css";
import { IMAGE_BASE_URL } from '../api/config';

const API_BASE = IMAGE_BASE_URL;

const formatVND = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductList = ({ mode = "all", take = 8 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedProductId, setAddedProductId] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data;
                if (mode === "newest") data = await productService.getNewestProducts(take);
                else if (mode === "bestseller") data = await productService.getBestSellerProducts(take);
                else data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [mode, take]);

    if (loading) {
        return (
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
        );
    }

    if (products.length === 0) {
        return (
            <div className="pl-empty">
                <span>🍰</span>
                <p>Chưa có sản phẩm nào trong hệ thống.</p>
            </div>
        );
    }

    return (
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
    );
};

export default ProductList;

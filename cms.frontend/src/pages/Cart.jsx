import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Cart.css";

const API_BASE = "https://localhost:7290";
const formatVND = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    // Đọc cart từ localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(saved);
    }, []);

    // Lưu cart vào localStorage mỗi khi thay đổi
    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        // Dispatch event để Header cập nhật badge
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const updateQty = (id, delta) => {
        const newCart = cart.map((item) =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        saveCart(newCart);
    };

    const removeItem = (id) => {
        saveCart(cart.filter((item) => item.id !== id));
    };

    const clearCart = () => saveCart([]);

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <>
            <Header />

            {/* Hero */}
            <div className="cart-hero">
                <div className="cart-hero-bg" />
                <div className="cart-hero-inner">
                    <div className="cart-hero-eyebrow">Mua sắm</div>
                    <h1 className="cart-hero-title">Giỏ <em>hàng</em></h1>
                    <p className="cart-hero-sub">{totalQty > 0 ? `${totalQty} sản phẩm đang chờ bạn` : "Giỏ hàng của bạn đang trống"}</p>
                </div>
            </div>

            <div className="cart-page">
                {cart.length === 0 ? (
                    /* Empty state */
                    <div className="cart-empty">
                        <span>🛒</span>
                        <h2>Giỏ hàng trống</h2>
                        <p>Hãy chọn thêm bánh ngon vào giỏ nhé!</p>
                        <button onClick={() => navigate("/products")}>
                            Khám phá sản phẩm →
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">

                        {/* ── Items ── */}
                        <div className="cart-items">
                            <div className="cart-items-header">
                                <span>Sản phẩm ({totalQty})</span>
                                <button className="cart-clear-btn" onClick={clearCart}>
                                    Xóa tất cả
                                </button>
                            </div>

                            {cart.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    {/* Image */}
                                    <div className="cart-item-img">
                                        {item.imageUrl ? (
                                            <img src={`${API_BASE}${item.imageUrl}`} alt={item.name} />
                                        ) : (
                                            <span>🍞</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-price">{formatVND(item.price)}</div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="cart-item-qty">
                                        <button onClick={() => updateQty(item.id, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, +1)}>+</button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="cart-item-subtotal">
                                        {formatVND(item.price * item.quantity)}
                                    </div>

                                    {/* Remove */}
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeItem(item.id)}
                                        title="Xóa"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* ── Summary ── */}
                        <div className="cart-summary">
                            <div className="cart-summary-title">Tóm tắt đơn hàng</div>

                            <div className="cart-summary-rows">
                                {cart.map((item) => (
                                    <div className="cart-summary-row" key={item.id}>
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>{formatVND(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary-divider" />

                            <div className="cart-summary-total">
                                <span>Tổng cộng</span>
                                <span>{formatVND(total)}</span>
                            </div>

                            <div className="cart-summary-note">
                                Phí giao hàng sẽ được tính ở bước thanh toán
                            </div>

                            <button
                                className="cart-checkout-btn"
                                onClick={() => navigate("/checkout")}
                            >
                                Tiến hành thanh toán →
                            </button>

                            <button
                                className="cart-continue-btn"
                                onClick={() => navigate("/products")}
                            >
                                ← Tiếp tục mua sắm
                            </button>
                        </div>

                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}

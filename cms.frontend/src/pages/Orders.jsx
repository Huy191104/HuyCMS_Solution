import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import orderService from "../services/orderService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Orders.css";

const formatVND = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
const API_BASE = "https://localhost:7290";

const STATUS_MAP = {
    0: { label: "Chờ duyệt", cls: "badge-pending" },
    1: { label: "Đang giao", cls: "badge-shipping" },
    2: { label: "Hoàn thành", cls: "badge-done" },
};

export default function Orders() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [detail, setDetail] = useState({});
    const [detailLoad, setDetailLoad] = useState(false);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrdersByCustomer(user.id);
            setOrders(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Toggle xem chi tiết đơn hàng
    const toggleDetail = async (orderId) => {
        if (expandedId === orderId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(orderId);
        if (detail[orderId]) return; // Đã load rồi

        try {
            setDetailLoad(true);
            const data = await orderService.getOrderById(orderId);
            setDetail((prev) => ({ ...prev, [orderId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setDetailLoad(false);
        }
    };

    return (
        <>
            <Header />

            {/* Hero */}
            <div className="ord-hero">
                <div className="ord-hero-bg" />
                <div className="ord-hero-inner">
                    <div className="ord-hero-eyebrow">Tài khoản</div>
                    <h1 className="ord-hero-title">Đơn hàng <em>của tôi</em></h1>
                    <p className="ord-hero-sub">
                        {loading ? "Đang tải..." : `${orders.length} đơn hàng`}
                    </p>
                </div>
            </div>

            <div className="ord-page">

                {loading ? (
                    <div className="ord-list">
                        {[...Array(3)].map((_, i) => (
                            <div className="ord-skeleton" key={i}>
                                <div className="ord-skeleton-line" style={{ width: "30%" }} />
                                <div className="ord-skeleton-line" style={{ width: "50%" }} />
                                <div className="ord-skeleton-line" style={{ width: "20%" }} />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    /* Empty state */
                    <div className="ord-empty">
                        <span>📦</span>
                        <h2>Chưa có đơn hàng nào</h2>
                        <p>Hãy chọn những chiếc bánh ngon và đặt hàng ngay!</p>
                        <button onClick={() => navigate("/products")}>
                            Khám phá sản phẩm →
                        </button>
                    </div>
                ) : (
                    <div className="ord-list">
                        {orders.map((order) => {
                            const status = STATUS_MAP[order.status] || STATUS_MAP[0];
                            const isOpen = expandedId === order.id;
                            const orderDetail = detail[order.id];

                            return (
                                <div className={`ord-card ${isOpen ? "ord-card--open" : ""}`} key={order.id}>

                                    {/* ── Header row ── */}
                                    <div className="ord-card-header" onClick={() => toggleDetail(order.id)}>
                                        <div className="ord-card-left">
                                            <div className="ord-id">Đơn #{order.id}</div>
                                            <div className="ord-date">📅 {formatDate(order.orderDate)}</div>
                                        </div>
                                        <div className="ord-card-mid">
                                            <div className="ord-items-count">
                                                {order.totalItems} sản phẩm
                                            </div>
                                            <div className="ord-total">
                                                {formatVND(order.totalAmount)}
                                            </div>
                                        </div>
                                        <div className="ord-card-right">
                                            <span className={`ord-badge ${status.cls}`}>
                                                {status.label}
                                            </span>
                                            <span className={`ord-chevron ${isOpen ? "ord-chevron--open" : ""}`}>
                                                ▾
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Detail panel ── */}
                                    {isOpen && (
                                        <div className="ord-detail">
                                            {detailLoad && !orderDetail ? (
                                                <div className="ord-detail-loading">Đang tải chi tiết...</div>
                                            ) : orderDetail ? (
                                                <>
                                                    {/* Notes */}
                                                    {orderDetail.notes && (
                                                        <div className="ord-notes">
                                                            <i>📝</i> {orderDetail.notes}
                                                        </div>
                                                    )}

                                                    {/* Items */}
                                                    <div className="ord-items">
                                                        {orderDetail.items?.map((item, i) => (
                                                            <div className="ord-item" key={i}>
                                                                <div className="ord-item-img">
                                                                    {item.imageUrl ? (
                                                                        <img src={`${API_BASE}${item.imageUrl}`} alt={item.productName} />
                                                                    ) : (
                                                                        <span>🍞</span>
                                                                    )}
                                                                </div>
                                                                <div className="ord-item-info">
                                                                    <div className="ord-item-name">{item.productName}</div>
                                                                    <div className="ord-item-meta">
                                                                        {formatVND(item.unitPrice)} × {item.quantity}
                                                                    </div>
                                                                </div>
                                                                <div className="ord-item-subtotal">
                                                                    {formatVND(item.unitPrice * item.quantity)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Summary */}
                                                    <div className="ord-summary">
                                                        <span>Tổng cộng</span>
                                                        <span className="ord-summary-total">
                                                            {formatVND(orderDetail.totalAmount)}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="ord-actions">
                                                        <button
                                                            className="ord-btn-shop"
                                                            onClick={() => navigate("/products")}
                                                        >
                                                            🛍️ Mua thêm
                                                        </button>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}

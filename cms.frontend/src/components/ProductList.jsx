import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải danh sách sản phẩm thời trang...</div>;
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12"><p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p></div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card shadow-sm border-0 h-100">
                            {item.imageUrl && (
                                <img
                                    src={`https://localhost:7290${item.imageUrl}`}
                                    alt={item.name}
                                    className="card-img-top"
                                    style={{
                                        height: "400px",
                                        objectFit: "cover"
                                    }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-dark">{item.name}</h5>
                                <p className="card-text text-danger font-weight-bold">
                                    {/* Hàm tự động chuyển số thành định dạng tiền tệ Việt Nam (VND) */}
                                    Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                                <p className="card-text small text-muted">Số lượng tồn kho: {item.stockQuantity} sản phẩm</p>
                            </div>
                            <div className="card-footer bg-transparent border-top-0">
                                <button className="btn btn-outline-primary btn-block btn-sm">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;

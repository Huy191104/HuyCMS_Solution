import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = () => {
    // 1. Khai báo state để lưu trữ danh sách danh mục SẢN PHẨM trả về từ API
    const [categoryProducts, setCategoryProducts] = useState([]);

    // 2. State quản lý trạng thái hiển thị loading (hiệu ứng chờ) trong lúc đợi API phản hồi
    const [loading, setLoading] = useState(true);

    // 3. useEffect tự động chạy một lần duy nhất sau khi Component được mount vào giao diện
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Gọi sang lớp Service để thực hiện Request HTTP GET đến API Backend
                const data = await categoryProductService.getAllCategoryProducts();

                // Cập nhật mảng dữ liệu nhận được vào State
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                // Tắt trạng thái loading dù API chạy thành công hay thất bại
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []); // Mảng phụ thuộc rỗng [] đảm bảo hàm này không bị gọi lặp vô hạn

    // 4. Xử lý giao diện tạm thời trong lúc hệ thống đang tải dữ liệu
    if (loading) {
        return <div className="text-center my-4">Đang tải danh mục sản phẩm...</div>;
    }

    // 5. Render cấu trúc giao diện danh mục sản phẩm ra HTML
    return (
        <div className="card shadow-sm border-0 rounded-lg">
            {/* Phần Header của chiếc hộp Danh mục */}
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                <h5 className="card-title text-uppercase font-weight-bold text-dark d-flex align-items-center mb-0" style={{ letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-cubes text-primary mr-2" style={{ fontSize: '1.3rem' }}></i> Danh mục SP
                </h5>
            </div>

            {/* Phần thân chứa danh sách các hàng */}
            <div className="card-body p-0">
                <div className="list-group list-group-flush">
                    {categoryProducts.length === 0 ? (
                        <div className="p-4 text-center text-muted">Không có danh mục nào.</div>
                    ) : (
                        categoryProducts.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-4 py-3 transition-all"
                                style={{ fontSize: '0.95rem', color: '#495057' }}
                            >
                                <span className="font-weight-normal">{item.name}</span>
                                {/* Icon mũi tên nhỏ tinh tế ở góc phải thay vì chữ 'Xem ngay' bị thô */}
                                <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: '0.8rem', opacity: 0.5 }}></i>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductList;

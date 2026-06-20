import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách (Hỗ trợ lọc theo khoảng giá, danh mục...)
    getAllProducts: (params = {}) => {
        const url = '/ApiProducts'; // Phải khớp chính xác với Router trong ProductsController phía Backend
        return axiosClient.get(url, { params });
    },
    // Hàm gọi API lấy sản phẩm mới nhất (Có thể truyền tham số 'take' để giới hạn số lượng sản phẩm trả về)
    getNewestProducts: async (take = 8) => {
        const url = `/Apiproducts/newest?take=${take}`;
        return axiosClient.get(url);
    },
    // Hàm gọi API lấy sản phẩm bán chạy nhất (Có thể truyền tham số 'take' để giới hạn số lượng sản phẩm trả về)
    getBestSellerProducts: async (take = 8) => {
        const url = `/Apiproducts/bestseller?take=${take}`;
        return axiosClient.get(url);
    },
    // Hàm gọi API lấy sản phẩm theo ID
    getProductById: async (id) => {
        const url = (`/Apiproducts/${id}`);
        return axiosClient.get(url);
    },
    // Hàm gọi API tìm kiếm sản phẩm theo từ khóa
    searchProducts: (query) => {
        const url = `/Apiproducts/search?q=${encodeURIComponent(query)}`;
        return axiosClient.get(url);
    },
};

export default productService;

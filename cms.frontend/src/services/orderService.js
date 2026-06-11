import axiosClient from '../api/axiosClient';

const orderService = {

    // Tạo đơn hàng mới
    createOrder: (data) => {
        return axiosClient.post('/Apiorders', data);
    },

    // Lấy danh sách đơn hàng theo customerId
    getOrdersByCustomer: (customerId) => {
        return axiosClient.get(`/Apiorders/customer/${customerId}`);
    },

    // Lấy chi tiết 1 đơn hàng
    getOrderById: (id) => {
        return axiosClient.get(`/Apiorders/${id}`);
    },
};

export default orderService;
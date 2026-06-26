import axiosClient from '../api/axiosClient';

const customerService = {
    // Lấy thông tin chi tiết khách hàng
    getProfile: (id) => {
        return axiosClient.get(`/ApiCustomers/${id}`);
    },

    // Cập nhật thông tin khách hàng
    updateProfile: (id, data) => {
        return axiosClient.put(`/ApiCustomers/${id}`, data);
    }
};

export default customerService;

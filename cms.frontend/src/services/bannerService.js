import axiosClient from '../api/axiosClient';

const bannerService = {
    // Hàm gọi API lấy danh sách các banner đang hoạt động
    getActiveBanners: async () => {
        const res = await axiosClient.get('/ApiBanners/active');
        return res || [];
    }
};

export default bannerService;

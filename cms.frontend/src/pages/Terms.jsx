import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Terms.css";

export default function Terms() {
    return (
        <>
            <Header />

            {/* Hero */}
            <div className="tm-hero">
                <div className="tm-hero-bg" />
                <div className="tm-hero-inner">
                    <div className="tm-hero-eyebrow">Điều khoản sử dụng</div>
                    <h1 className="tm-hero-title">Điều khoản <em>giao dịch</em></h1>
                    <p className="tm-hero-sub">
                        Quy định và hướng dẫn chi tiết dành cho khách hàng mua sắm tại Bakery House
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="tm-section">
                <div className="tm-container">
                    <div className="tm-card">
                        <p className="tm-intro">
                            Chào mừng bạn đến với hệ thống đặt bánh trực tuyến của <strong>Bakery House</strong>. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các quy định dưới đây. Xin vui lòng đọc kỹ trước khi bắt đầu đặt đơn hàng đầu tiên của mình.
                        </p>

                        <div className="tm-divider" />

                        <div className="tm-block">
                            <h2 className="tm-title"><span>1.</span> Tài khoản thành viên</h2>
                            <p className="tm-desc">
                                Khi tạo tài khoản tại Bakery House, bạn cần đảm bảo các thông tin cá nhân cung cấp là chính xác và đầy đủ. Bạn chịu trách nhiệm hoàn toàn đối với việc bảo mật mật khẩu của mình. Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ sự sơ suất bảo mật tài khoản từ phía khách hàng.
                            </p>
                        </div>

                        <div className="tm-block">
                            <h2 className="tm-title"><span>2.</span> Đặt hàng và Xác nhận đơn</h2>
                            <p className="tm-desc">
                                Vì bánh ngọt tại cửa hàng được làm thủ công và tươi mới mỗi ngày để đảm bảo độ ngon nhất:
                            </p>
                            <ul className="tm-list">
                                <li>Mọi đơn đặt hàng trực tuyến sẽ được ghi nhận và gửi email xác nhận.</li>
                                <li>Nhân viên của Bakery House có thể gọi điện xác nhận lại một số đơn hàng đặc biệt (như bánh kem sinh nhật đặt làm theo mẫu yêu cầu) trước khi bắt đầu chế biến.</li>
                                <li>Khách hàng cần ghi chú rõ ràng về thời gian muốn nhận bánh và các yêu cầu dị ứng nguyên liệu (nếu có).</li>
                            </ul>
                        </div>

                        <div className="tm-block">
                            <h2 className="tm-title"><span>3.</span> Giá cả và Thanh toán</h2>
                            <p className="tm-desc">
                                Đơn giá hiển thị trên website là giá bán chính thức bằng Việt Nam Đồng (VNĐ). Khách hàng có thể lựa chọn 2 hình thức thanh toán sau:
                            </p>
                            <ul className="tm-list">
                                <li>Thanh toán trực tiếp bằng tiền mặt khi nhận bánh (COD).</li>
                                <li>Thanh toán chuyển khoản trực tuyến thông qua cổng thanh toán được tích hợp.</li>
                            </ul>
                        </div>

                        <div className="tm-block">
                            <h2 className="tm-title"><span>4.</span> Chính sách Hủy đơn và Hoàn trả</h2>
                            <p className="tm-desc">
                                Do tính chất bánh là sản phẩm tươi ngắn ngày:
                            </p>
                            <ul className="tm-list">
                                <li>Đối với đơn bánh ngọt nhỏ thường ngày: Bạn có thể hủy đơn trước giờ giao dự kiến ít nhất 2 tiếng.</li>
                                <li>Đối với đơn bánh kem sinh nhật, bánh sự kiện lớn đặt trước: Bạn vui lòng thông báo hủy trước ít nhất 12 tiếng.</li>
                                <li>Chúng tôi hỗ trợ đổi sản phẩm mới hoặc hoàn tiền 100% nếu bánh giao đến không đúng mẫu đã đặt, bánh bị dập nát do lỗi vận chuyển hoặc có vấn đề về vệ sinh an toàn thực phẩm.</li>
                            </ul>
                        </div>

                        <div className="tm-block">
                            <h2 className="tm-title"><span>5.</span> Quy định Giao nhận bánh</h2>
                            <p className="tm-desc">
                                Bakery House cam kết bảo quản bánh ở nhiệt độ thích hợp trong hộp chuyên dụng suốt quá trình vận chuyển:
                            </p>
                            <ul className="tm-list">
                                <li>Bánh sẽ được giao tới đúng địa chỉ khách hàng cung cấp.</li>
                                <li>Xin vui lòng kiểm tra kỹ hình thức bánh trước khi thanh toán và ký nhận đơn hàng.</li>
                                <li>Sau khi nhận bánh thành công, quý khách vui lòng bảo quản lạnh theo hướng dẫn ghi kèm trên vỏ hộp để giữ bánh tươi ngon lâu nhất.</li>
                            </ul>
                        </div>

                        <div className="tm-divider" />

                        <p className="tm-footer-note">
                            Bakery House có quyền cập nhật và thay đổi các điều khoản này theo thời gian mà không cần báo trước. Tiếp tục sử dụng trang web sau các thay đổi nghĩa là bạn đồng ý với các cập nhật mới đó.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

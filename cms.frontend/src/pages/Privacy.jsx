import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/Privacy.css";

export default function Privacy() {
    return (
        <>
            <Header />

            {/* Hero */}
            <div className="pv-hero">
                <div className="pv-hero-bg" />
                <div className="pv-hero-inner">
                    <div className="pv-hero-eyebrow">Chính sách bảo mật</div>
                    <h1 className="pv-hero-title">Bảo mật <em>thông tin</em></h1>
                    <p className="pv-hero-sub">
                        Bakery House cam kết bảo vệ tuyệt đối thông tin riêng tư của khách hàng
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="pv-section">
                <div className="pv-container">
                    <div className="pv-card">
                        <p className="pv-intro">
                            Chào mừng bạn đến với <strong>Bakery House</strong>. Chúng tôi rất coi trọng quyền riêng tư của bạn và cam kết bảo vệ các thông tin cá nhân mà bạn cung cấp khi mua sắm hoặc truy cập vào trang web của chúng tôi. Dưới đây là chi tiết về chính sách bảo mật thông tin của chúng tôi.
                        </p>

                        <div className="pv-divider" />

                        <div className="pv-block">
                            <h2 className="pv-title"><span>1.</span> Thu thập thông tin cá nhân</h2>
                            <p className="pv-desc">
                                Khi bạn đăng ký tài khoản, đặt mua hàng hoặc liên hệ với chúng tôi, Bakery House sẽ thu thập các thông tin cá nhân cần thiết bao gồm:
                            </p>
                            <ul className="pv-list">
                                <li>Họ và tên của bạn để xác nhận danh tính người mua.</li>
                                <li>Địa chỉ Email để gửi thông tin đơn hàng và hóa đơn điện tử.</li>
                                <li>Số điện thoại dùng cho việc liên hệ xác nhận và giao bánh.</li>
                                <li>Địa chỉ giao hàng để chúng tôi giao bánh tới tận tay bạn một cách chính xác nhất.</li>
                            </ul>
                        </div>

                        <div className="pv-block">
                            <h2 className="pv-title"><span>2.</span> Sử dụng thông tin khách hàng</h2>
                            <p className="pv-desc">
                                Các thông tin thu thập được sẽ chỉ được sử dụng cho các mục đích hợp pháp sau đây:
                            </p>
                            <ul className="pv-list">
                                <li>Xử lý, đóng gói và vận chuyển đơn đặt hàng của bạn.</li>
                                <li>Hỗ trợ khách hàng, giải đáp thắc mắc và tư vấn về các loại bánh.</li>
                                <li>Thông báo tình trạng đơn hàng (chờ duyệt, đang giao, hoàn thành).</li>
                                <li>Cập nhật các chương trình khuyến mãi, ưu đãi đặc biệt hoặc bánh mới (chỉ khi được bạn cho phép).</li>
                            </ul>
                        </div>

                        <div className="pv-block">
                            <h2 className="pv-title"><span>3.</span> Bảo mật thông tin cá nhân</h2>
                            <p className="pv-desc">
                                Bakery House sử dụng các biện pháp bảo mật công nghệ cao để bảo vệ thông tin của bạn khỏi việc truy cập trái phép, mất mát hoặc phá hoại:
                            </p>
                            <ul className="pv-list">
                                <li>Mật khẩu tài khoản của bạn được mã hóa an toàn bằng công nghệ băm một chiều (BCrypt) ở phía server.</li>
                                <li>Tất cả dữ liệu giao dịch trực tuyến được mã hóa bảo vệ trong suốt quá trình truyền tải dữ liệu.</li>
                                <li>Hệ thống lưu trữ cơ sở dữ liệu được đặt trong môi trường an toàn và bảo mật nghiêm ngặt.</li>
                            </ul>
                        </div>

                        <div className="pv-block">
                            <h2 className="pv-title"><span>4.</span> Chia sẻ thông tin với bên thứ ba</h2>
                            <p className="pv-desc">
                                Chúng tôi tuyệt đối không bán, trao đổi hoặc cho bên thứ ba thuê thông tin cá nhân của bạn vì mục đích thương mại. Thông tin giao hàng (tên, số điện thoại, địa chỉ) chỉ được chia sẻ duy nhất cho các đối tác vận chuyển uy tín của chúng tôi để thực hiện công việc giao bánh.
                            </p>
                        </div>

                        <div className="pv-block">
                            <h2 className="pv-title"><span>5.</span> Quyền lợi và lựa chọn của bạn</h2>
                            <p className="pv-desc">
                                Bạn hoàn toàn có quyền kiểm soát thông tin cá nhân của mình bất kỳ lúc nào:
                            </p>
                            <ul className="pv-list">
                                <li>Bạn có quyền đăng nhập vào hệ thống để tự thay đổi thông tin cá nhân hoặc địa chỉ giao hàng tại trang <strong>Hồ sơ cá nhân</strong>.</li>
                                <li>Bạn có quyền yêu cầu Bakery House tạm khóa hoặc xóa hoàn toàn tài khoản và dữ liệu cá nhân của bạn khỏi hệ thống bằng cách liên hệ với bộ phận hỗ trợ của chúng tôi.</li>
                            </ul>
                        </div>

                        <div className="pv-divider" />

                        <p className="pv-footer-note">
                            Nếu bạn có bất kỳ câu hỏi nào liên quan đến Chính sách bảo mật này, xin vui lòng gửi email về cho chúng tôi tại địa chỉ: <strong>support@bakeryhouse.vn</strong> hoặc gọi hotline: <strong>0909 123 456</strong>.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

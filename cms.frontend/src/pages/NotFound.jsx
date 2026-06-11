import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/NotFound.css";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="nf-page">
                <div className="nf-wrap">
                    <div className="nf-code">404</div>
                    <div className="nf-emoji">🍰</div>
                    <h1 className="nf-title">Trang không tìm thấy</h1>
                    <p className="nf-desc">
                        Có vẻ như trang bạn đang tìm kiếm đã được ăn mất rồi!<br />
                        Hãy quay lại và khám phá những chiếc bánh ngon của chúng tôi.
                    </p>
                    <div className="nf-actions">
                        <button className="nf-btn-primary" onClick={() => navigate("/")}>
                            🏠 Về trang chủ
                        </button>
                        <button className="nf-btn-outline" onClick={() => navigate("/products")}>
                            🎂 Xem sản phẩm
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

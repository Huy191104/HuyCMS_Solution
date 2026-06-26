import { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';
import "../assets/css/CategoryProductList.css";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from '../api/config';

const API_BASE = IMAGE_BASE_URL;

const CategoryProductList = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    // Icon mapping theo tên danh mục làm phương án fallback
    const getIcon = (name = "") => {
        const n = name.toLowerCase();
        if (n.includes("combo") || n.includes("tiệc")) return "🎉";
        if (n.includes("cheesecake")) return "🍰";
        if (n.includes("cookies") || n.includes("quy")) return "🍪";
        if (n.includes("cupcake")) return "🧁";
        if (n.includes("tiramisu")) return "☕";
        if (n.includes("mousse")) return "🍮";
        if (n.includes("kem tươi") || n.includes("kem")) return "🍦";
        if (n.includes("sinh nhật")) return "🎂";
        return "🍞";
    };

    if (loading) {
        return (
            <div className="cpl-grid">
                {[...Array(6)].map((_, i) => (
                    <div className="cpl-skeleton-card" key={i}>
                        <div className="cpl-skeleton-circle" />
                        <div className="cpl-skeleton-text" />
                    </div>
                ))}
            </div>
        );
    }

    if (categoryProducts.length === 0) {
        return (
            <div className="cpl-empty">
                <span>🍞</span>
                <p>Chưa có danh mục nào.</p>
            </div>
        );
    }

    return (
        <div className="cpl-grid">
            {categoryProducts.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className={`cpl-card ${active === item.id ? "cpl-card--active" : ""}`}
                    onClick={() => {
                        setActive(item.id);
                        navigate(`/products?category=${item.id}`);
                    }}
                >
                    <div className="cpl-img-wrap">
                        {item.imageUrl ? (
                            <img
                                src={`${API_BASE}${item.imageUrl}`}
                                alt={item.name}
                                className="cpl-img"
                            />
                        ) : (
                            <div className="cpl-fallback-img">
                                {getIcon(item.name)}
                            </div>
                        )}
                    </div>
                    <div className="cpl-name">{item.name}</div>
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;

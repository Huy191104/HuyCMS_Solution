import { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';
import "../assets/css/CategoryProductList.css";
import { useNavigate } from "react-router-dom";

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

    // Icon mapping theo tên danh mục
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
                    <div className="cpl-skeleton" key={i} />
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
                    <div className="cpl-icon">{getIcon(item.name)}</div>
                    <div className="cpl-name">{item.name}</div>
                    <div className="cpl-arrow">→</div>
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;

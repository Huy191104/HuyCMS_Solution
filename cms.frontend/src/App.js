import React from 'react';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import CategoryProductList from './components/CategoryProductList';

function App() {
    return (
        <div className="container mt-5">
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark">
                    👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                </span>
            </header>

            {/* KHU VỰC 1: SHOPPING (Sản phẩm và Bộ lọc danh mục sản phẩm) */}
            <div className="row">
                <div className="col-md-4">
                    <CategoryProductList />
                </div>
                <div className="col-md-8">
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">Bộ sưu tập mới nhất</h4>
                    <ProductList />
                </div>
            </div>

            {/* KHU VỰC 2: BLOG & BLOG CATEGORIES (Tin tức thời trang công sở, dạ hội) */}
            <div className="row mt-5">
                <div className="col-12">
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;

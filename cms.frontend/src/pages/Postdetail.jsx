import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../assets/css/PostDetail.css";

const API_BASE = "https://localhost:7290";
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function Postdetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="pd-loading">
                    <div className="pd-loading-img" />
                    <div className="pd-loading-lines">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="pd-loading-line" style={{ width: `${85 - i * 10}%` }} />
                        ))}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Header />
                <div className="pd-notfound">
                    <span>📰</span>
                    <h2>Không tìm thấy bài viết</h2>
                    <button onClick={() => navigate("/posts")}>← Quay lại danh sách</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* Hero với ảnh bài viết */}
            <div className="pd-hero" style={post.imageUrl ? {
                backgroundImage: `url(${API_BASE}${post.imageUrl})`
            } : {}}>
                <div className="pd-hero-overlay" />
                <div className="pd-hero-inner">
                    {post.category?.name && (
                        <div className="pd-cat-badge">{post.category.name}</div>
                    )}
                    <h1 className="pd-title">{post.title}</h1>
                    <div className="pd-meta">
                        <span>📅 {formatDate(post.createdDate)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pd-page">
                <div className="pd-layout">

                    {/* ── Article ── */}
                    <article className="pd-article">
                        <div
                            className="pd-content"
                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                        />

                        {/* Back button */}
                        <div className="pd-back">
                            <button onClick={() => navigate("/posts")}>
                                ← Quay lại danh sách bài viết
                            </button>
                        </div>
                    </article>

                    {/* ── Sidebar ── */}
                    <aside className="pd-sidebar">
                        <div className="pd-sidebar-card">
                            <div className="pd-sidebar-title">Thông tin bài viết</div>
                            <div className="pd-sidebar-row">
                                <span>📅 Ngày đăng</span>
                                <span>{formatDate(post.createdDate)}</span>
                            </div>
                            {post.category?.name && (
                                <div className="pd-sidebar-row">
                                    <span>🏷️ Chuyên mục</span>
                                    <span>{post.category.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="pd-sidebar-card">
                            <div className="pd-sidebar-title">Khám phá thêm</div>
                            <button
                                className="pd-sidebar-btn"
                                onClick={() => navigate("/posts")}
                            >
                                📰 Tất cả bài viết
                            </button>
                            <button
                                className="pd-sidebar-btn"
                                onClick={() => navigate("/products")}
                            >
                                🎂 Xem sản phẩm
                            </button>
                        </div>
                    </aside>

                </div>
            </div>

            <Footer />
        </>
    );
}

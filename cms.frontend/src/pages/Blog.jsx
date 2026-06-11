import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../assets/css/Blog.css";

const API_BASE = "https://localhost:7290";
const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function Blog() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCat, setActiveCat] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [postsData, catsData] = await Promise.all([
                    postService.getAllPosts(),
                    postService.getPostCategories(),
                ]);
                setPosts(Array.isArray(postsData) ? postsData : []);
                setCategories(Array.isArray(catsData) ? catsData : []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const filtered = posts.filter((p) => {
        const matchCat = activeCat ? p.categoryId === activeCat : true;
        console.log(posts[0]);
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    // Bài viết đầu tiên làm featured
    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <>
            <Header />

            {/* Hero */}
            <div className="blog-hero">
                <div className="blog-hero-bg" />
                <div className="blog-hero-inner">
                    <div className="blog-hero-eyebrow">Cẩm nang</div>
                    <h1 className="blog-hero-title">Tin tức & <em>bánh ngọt</em></h1>
                    <p className="blog-hero-sub">Bí quyết, công thức và câu chuyện từ bếp bánh của chúng tôi</p>
                </div>
            </div>

            <div className="blog-page">

                {/* Toolbar */}
                <div className="blog-toolbar">
                    <div className="blog-search">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm bài viết..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="blog-cats">
                        <button
                            className={`blog-cat-btn ${activeCat === null ? "active" : ""}`}
                            onClick={() => setActiveCat(null)}
                        >Tất cả</button>
                        {categories.map((c) => (
                            <button
                                key={c.id}
                                className={`blog-cat-btn ${activeCat === c.id ? "active" : ""}`}
                                onClick={() => setActiveCat(c.id)}
                            >{c.name}</button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="blog-grid">
                        {[...Array(6)].map((_, i) => (
                            <div className="blog-skeleton" key={i}>
                                <div className="blog-skeleton-img" />
                                <div className="blog-skeleton-body">
                                    <div className="blog-skeleton-line" style={{ width: "75%" }} />
                                    <div className="blog-skeleton-line" style={{ width: "55%" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="blog-empty">
                        <span>📰</span>
                        <p>Không tìm thấy bài viết phù hợp.</p>
                        <button onClick={() => { setSearch(""); setActiveCat(null); }}>Xoá bộ lọc</button>
                    </div>
                ) : (
                    <>
                        {/* Featured post */}
                        {featured && (
                            <div className="blog-featured" onClick={() => navigate(`/posts/${featured.id}`)}>
                                <div className="blog-featured-img">
                                    {featured.imageUrl ? (
                                        <img src={`${API_BASE}${featured.imageUrl}`} alt={featured.title} />
                                    ) : (
                                        <div className="blog-featured-placeholder">📰</div>
                                    )}
                                </div>
                                <div className="blog-featured-body">
                                    <div className="blog-featured-eyebrow">Bài viết nổi bật</div>
                                    <h2 className="blog-featured-title">{featured.title}</h2>
                                    <p className="blog-featured-excerpt">
                                        {stripHtml(featured.content || "").substring(0, 200)}...
                                    </p>
                                    <div className="blog-featured-meta">
                                        <span>📅 {formatDate(featured.createdDate)}</span>
                                        <span className="blog-read-more">Đọc bài →</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rest grid */}
                        {rest.length > 0 && (
                            <div className="blog-grid">
                                {rest.map((post) => (
                                    <div
                                        className="blog-card"
                                        key={post.id}
                                        onClick={() => navigate(`/posts/${post.id}`)}
                                    >
                                        <div className="blog-card-img">
                                            {post.imageUrl ? (
                                                <img src={`${API_BASE}${post.imageUrl}`} alt={post.title} />
                                            ) : (
                                                <div className="blog-card-placeholder">📰</div>
                                            )}
                                        </div>
                                        <div className="blog-card-body">
                                            <div className="blog-card-date">{formatDate(post.createdDate)}</div>
                                            <h3 className="blog-card-title">{post.title}</h3>
                                            <p className="blog-card-excerpt">
                                                {stripHtml(post.content || "").substring(0, 90)}...
                                            </p>
                                            <span className="blog-read-more">Đọc tiếp →</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}

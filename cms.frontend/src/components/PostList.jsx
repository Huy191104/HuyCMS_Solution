import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import "../assets/css/PostList.css";
import { IMAGE_BASE_URL } from '../api/config';

const API_BASE = IMAGE_BASE_URL;

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "");
const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await postService.getAllPosts();

                const latestPosts = data
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                    .slice(0, 3);

                setPosts(latestPosts);
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi khi tải bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="plist-grid">
                {[...Array(3)].map((_, i) => (
                    <div className="plist-skeleton" key={i}>
                        <div className="plist-skeleton-img" />
                        <div className="plist-skeleton-body">
                            <div className="plist-skeleton-line" style={{ width: "80%" }} />
                            <div className="plist-skeleton-line" style={{ width: "60%" }} />
                            <div className="plist-skeleton-line" style={{ width: "40%" }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="plist-empty">
                <span>📰</span>
                <p>Chưa có bài viết nào.</p>
            </div>
        );
    }

    return (
        <div className="plist-grid">
            {posts.slice(0, 3).map((post) => (
                <div
                    className="plist-card"
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                >
                    {/* Image */}
                    <div className="plist-img-wrap">
                        {post.imageUrl ? (
                            <img
                                src={`${API_BASE}${post.imageUrl}`}
                                alt={post.title}
                                className="plist-img"
                            />
                        ) : (
                            <div className="plist-img-plistaceholder">📰</div>
                        )}
                        {post.category?.name && (
                            <div className="plist-cat-badge">{post.category.name}</div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="plist-body">
                        <div className="plist-date">{formatDate(post.createdDate)}</div>
                        <h3 className="plist-title">{post.title}</h3>
                        <p className="plist-excerpt">
                            {stripHtml(post.content || "").substring(0, 100)}
                            {stripHtml(post.content || "").length > 100 ? "..." : ""}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="plist-footer">
                        <span className="plist-read-more">Đọc tiếp →</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;

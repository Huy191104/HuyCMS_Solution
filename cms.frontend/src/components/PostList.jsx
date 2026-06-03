import React, { useState, useEffect } from 'react';
import blogService from '../services/postService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Đang tải tin tức thời trang...</div>;
    }

    return (
        <div className="mt-5">
            <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                <i className="fa-solid fa-newspaper text-info mr-2"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {posts.length === 0 ? (
                <p className="text-muted">Chưa có bài viết tin tức nào.</p>
            ) : (
                    <div className="row">
                    {posts.map((post) => (
                        <div className="col-12 mb-3" key={post.id}>
                            <div className="card shadow-sm border-light">

                                {post.imageUrl && (
                                    <img
                                        src={`https://localhost:7290${post.imageUrl}`}
                                        alt={post.title}
                                        className="card-img-top"
                                        style={{
                                            height: "220px",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}

                                <div className="card-body">
                                    <h5 className="card-title font-weight-bold">
                                        <a
                                            href={`/post/${post.id}`}
                                            className="text-dark text-decoration-none hover-link"
                                        >
                                            {post.title}
                                        </a>
                                    </h5>

                                    <p className="card-text text-muted small">
                                        {post.content
                                            ?.replace(/<[^>]+>/g, '')
                                            ?.substring(0, 100) || 'Đang cập nhật nội dung tóm tắt cho bài viết...'}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center text-secondary small">
                                        <span>
                                            <i className="fa-regular fa-calendar mr-1"></i>
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </span>

                                        <span className="badge badge-info px-2 py-1">
                                            Xem thêm
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;

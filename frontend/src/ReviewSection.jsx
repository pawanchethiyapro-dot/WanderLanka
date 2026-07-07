import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import { useAuth } from './context/AuthContext';

function ReviewSection({ itemType, itemId }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pre-fill user name if logged in
    useEffect(() => {
        if (user && user.email) {
            // Take the part of the email before @ or standard name
            const name = user.email.split('@')[0];
            setCustomerName(name.charAt(0).toUpperCase() + name.slice(1));
        } else {
            setCustomerName('');
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/reviews/${itemType}/${itemId}`);
            setReviews(res.data.reviews || []);
            setStats({
                averageRating: res.data.averageRating || 0,
                reviewCount: res.data.reviewCount || 0
            });
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    useEffect(() => {
        if (itemId) {
            fetchReviews();
        }
    }, [itemType, itemId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!customerName.trim() || !comment.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/reviews', {
                itemType,
                itemId,
                customerName,
                rating,
                comment
            });
            setSuccess('Review submitted successfully! Thank you.');
            setComment('');
            if (!user) {
                setCustomerName('');
            }
            setRating(5);
            fetchReviews();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to submit review.');
        }
    };

    const renderStars = (count, size = 18, fillOnly = false) => {
        const stars = [];
        const floor = Math.floor(count);
        for (let i = 1; i <= 5; i++) {
            let isFilled = false;
            if (fillOnly) {
                isFilled = i <= count;
            } else {
                isFilled = i <= floor;
            }
            stars.push(
                <Star
                    key={i}
                    size={size}
                    fill={isFilled ? 'var(--accent-amber)' : 'none'}
                    color={isFilled ? 'var(--accent-amber)' : '#cbd5e1'}
                    style={{ marginRight: '2px' }}
                />
            );
        }
        return stars;
    };

    return (
        <div style={{ marginTop: '40px', width: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ 
                fontSize: '24px', 
                marginBottom: '20px', 
                borderBottom: '2px solid var(--border)', 
                paddingBottom: '10px',
                color: 'var(--text-h)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <span>💬 Guest Reviews ({stats.reviewCount})</span>
                {stats.reviewCount > 0 && (
                    <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', color: 'var(--text-light)' }}>
                        <span style={{ display: 'flex' }}>{renderStars(stats.averageRating, 18, true)}</span>
                        <strong style={{ color: 'var(--text-h)' }}>{stats.averageRating}</strong> / 5
                    </span>
                )}
            </h2>

            {/* Review Form */}
            <div className="card" style={{ 
                padding: '24px', 
                marginBottom: '30px', 
                background: 'var(--card-bg)', 
                border: '1px solid var(--border)',
                borderRadius: '16px'
            }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-h)' }}>Write a Review</h3>
                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>⚠️ {error}</div>}
                    {success && <div style={{ color: 'var(--accent-green)', fontSize: '14px', fontWeight: '600' }}>🎉 {success}</div>}

                    {/* Star Rating Selector */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-h)' }}>Rating</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {[1, 2, 3, 4, 5].map((index) => {
                                const isFilled = hoverRating ? index <= hoverRating : index <= rating;
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        onClick={() => setRating(index)}
                                        onMouseEnter={() => setHoverRating(index)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: '2px',
                                            cursor: 'pointer',
                                            boxShadow: 'none',
                                            transform: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Star
                                            size={28}
                                            fill={isFilled ? 'var(--accent-amber)' : 'none'}
                                            color={isFilled ? 'var(--accent-amber)' : '#94a3b8'}
                                            style={{ transition: 'transform 0.1s' }}
                                        />
                                    </button>
                                );
                            })}
                            <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: '600', color: 'var(--text-light)' }}>
                                {rating} Star{rating > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Customer Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-h)' }}>Your Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            disabled={!!user}
                            style={{ 
                                width: '100%', 
                                boxSizing: 'border-box',
                                background: user ? 'rgba(0, 0, 0, 0.05)' : 'var(--card-bg)',
                                cursor: user ? 'not-allowed' : 'text'
                            }}
                        />
                    </div>

                    {/* Comment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-h)' }}>Your Comment</label>
                        <textarea
                            required
                            rows="4"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ alignSelf: 'flex-start', marginTop: '5px' }}
                    >
                        Submit Review
                    </button>
                </form>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '30px', 
                        color: 'var(--text-light)', 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        border: '1px dashed var(--border)',
                        borderRadius: '12px' 
                    }}>
                        No reviews yet. Be the first to leave a review!
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev._id} className="card" style={{ 
                            padding: '20px', 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            boxShadow: 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-h)' }}>{rev.customerName}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {renderStars(rev.rating, 14, true)}
                                    </div>
                                </div>
                                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                    {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)', lineHeight: '1.5' }}>
                                {rev.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReviewSection;

import './StarRating.css';

const StarRating = ({ rating, totalStars = 5 }) => {
    const stars = [];

    let fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    let hasHalfStar = false;

    if (decimal >= 0.75) {
        fullStars += 1;
    } else if (decimal >= 0.25) {
        hasHalfStar = true;
    }


    for (let i = 1; i <= totalStars; i++) {
        if (i <= fullStars) {
            stars.push(<span key={i} className="full-star">★</span>);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<span key={i} className="half-star">★</span>);
        } else {
            stars.push(<span key={i} className="empty-star">★</span>);
        }
    }

    return <div className="star-rating">{stars}</div>;
};

export default StarRating;

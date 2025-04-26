import './StarRating.css';

const StarRating = ({ rating, totalStars = 5 }) => {
    const stars = [];
    console.log('rating is:', rating);

    let fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    let hasHalfStar = false;

    if (decimal >= 0.75) {
        fullStars += 1;
    } else if (decimal >= 0.25) {
        hasHalfStar = true;
    }

    console.log('full stars', fullStars);
    console.log('has half star:', hasHalfStar);

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

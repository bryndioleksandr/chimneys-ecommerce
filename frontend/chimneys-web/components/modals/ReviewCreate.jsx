import React, { useState } from 'react';
import axios from 'axios';
import Rating from "../ReviewStars/ReviewStars";

const ReviewForm = ({product}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5501/reviews/create', {
                name,
                email,
                rating,
                product,
                comment,
            });
            alert('Відгук додано!');

        } catch (error) {
            console.error('Помилка при додаванні відгуку:', error);
            alert('Помилка при додаванні відгуку');
        }
        try{
            const res = await fetch(`http://localhost:5501/reviews/product-reviews/${product}`);
            const data = await res.json();
            const validReviews = Array.isArray(data) ? data : [];

            const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = validReviews.length > 0 ? sum / validReviews.length : 0;

            await axios.patch(`http://localhost:5501/products/update-rating/${product}/${averageRating}`, {})
            await axios.patch(`http://localhost:5501/products/update-reviews/${product}`, {
                reviews: validReviews.map(review => review._id)
            });        } catch(error) {
            console.error('Помилка при оновленні рейтингу товару:', error);
            alert('Помилка при оновленні рейтингу товару');
        }
    };

    return (
        <div className="form-container">
            <h2>Залишити відгук</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ваше ім'я*"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <textarea
                    id="comment"
                    name="comment"
                    rows="5"
                    cols="40"
                    placeholder="Напишіть свій відгук тут..."
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>
                <Rating value={rating} onChange={(val) => setRating(val)} />
                <button type="submit">Підтвердити</button>
            </form>
        </div>
    );
};

export default ReviewForm;

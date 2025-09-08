class ReviewSystem {
    constructor() {
        this.reviews = this.loadReviews();
        this.currentRating = 0;
        this.initReviewSystem();
        this.setupPageChangeListener();
    }
    
    initReviewSystem() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
        });
        
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
        
        this.displayReviews();
    }
    
    setupPageChangeListener() {
        window.addEventListener('beforeunload', () => {
            localStorage.removeItem('levelUpGamerReviews');
        });
    }
    
    loadReviews() {
        try {
            const reviewsData = localStorage.getItem('levelUpGamerReviews');
            return reviewsData ? JSON.parse(reviewsData) : [];
        } catch (e) {
            console.error('Error loading reviews from localStorage:', e);
            return [];
        }
    }
    
    saveReviews() {
        try {
            localStorage.setItem('levelUpGamerReviews', JSON.stringify(this.reviews));
        } catch (e) {
            console.error('Error saving reviews to localStorage:', e);
        }
    }
    
    setRating(rating) {
        this.currentRating = rating;
        const ratingValue = document.getElementById('ratingValue');
        if (ratingValue) {
            ratingValue.value = rating;
        }
        
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    submitReview() {
        const nameInput = document.getElementById('reviewerName');
        const ratingInput = document.getElementById('ratingValue');
        const textInput = document.getElementById('reviewText');
        
        if (!nameInput || !ratingInput || !textInput) return;
        
        const name = nameInput.value;
        const rating = parseInt(ratingInput.value);
        const text = textInput.value;
        
        if (rating === 0) {
            alert('Por favor selecciona una calificación');
            return;
        }
        
        this.addReview(name, rating, text);

        if (document.getElementById('reviewForm')) {
            document.getElementById('reviewForm').reset();
        }
        this.setRating(0);
    }
    
    addReview(name, rating, text) {
        const newReview = {
            name,
            rating,
            text,
            date: new Date().toISOString().split('T')[0]
        };
        
        this.reviews.unshift(newReview);
        this.saveReviews();
        this.displayReviews();
        this.showReviewNotification();
    }
    
    displayReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        if (this.reviews.length === 0) {
            reviewsList.innerHTML = '<p class="empty-cart">No hay reseñas todavía. ¡Sé el primero en opinar!</p>';
            return;
        }
        
        reviewsList.innerHTML = this.reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }
    
    showReviewNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = '✅ ¡Gracias por tu reseña!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.reviewSystem = new ReviewSystem();
});
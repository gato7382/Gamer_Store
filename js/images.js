class ImageGallery {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.initGallery();
    }
    
    initGallery() {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        
        this.images = Array.from(thumbnails).map(thumb => {
            return thumb.querySelector('img').src;
        });
        
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.changeImage(index));
        });
        
        if (this.images.length > 0) {
            this.changeImage(0);
        }
    }
    
    changeImage(index) {
        this.currentImageIndex = index;
        const mainImage = document.getElementById('main-image');
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        
        if (mainImage && index < this.images.length) {
            mainImage.src = this.images[index];
        }
        
        if (thumbnails.length > 0) {
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            if (index < thumbnails.length) {
                thumbnails[index].classList.add('active');
            }
        }
    }
    
    nextImage() {
        let nextIndex = this.currentImageIndex + 1;
        if (nextIndex >= this.images.length) nextIndex = 0;
        this.changeImage(nextIndex);
    }
    
    prevImage() {
        let prevIndex = this.currentImageIndex - 1;
        if (prevIndex < 0) prevIndex = this.images.length - 1;
        this.changeImage(prevIndex);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.imageGallery = new ImageGallery();
});
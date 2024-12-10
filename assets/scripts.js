document.addEventListener("DOMContentLoaded", () => {
    // Select the gallery container and its items
    const gallery = document.querySelector(".gallery");
    const galleryItems = document.querySelectorAll(".gallery-item");

    // Extract unique tags for filtering gallery items
    const tags = [...new Set([...galleryItems].map(item => item.dataset.galleryTag))];
    const container = gallery.parentElement;
    gallery.style.display = "grid"; // Display gallery in grid format

    // Add filter navigation if tags exist
    if (tags.length > 0) {
        // Create navigation container
        const tagContainer = document.createElement("div");
        tagContainer.className = "nav nav-pills justify-content-center";
        container.prepend(tagContainer);

        // Create "All" filter button
        const allButton = document.createElement("button");
        allButton.className = "nav-link active";
        allButton.textContent = "Tous";
        allButton.dataset.tag = "all";
        tagContainer.appendChild(allButton);

        // Create buttons for each tag
        tags.forEach(tag => {
            const button = document.createElement("button");
            button.className = "nav-link";
            button.textContent = tag;
            button.dataset.tag = tag;
            tagContainer.appendChild(button);
        });

        // Add event listener to handle tag filtering
        tagContainer.addEventListener("click", e => {
            if (e.target.classList.contains("nav-link")) {
                // Highlight the active button
                document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");

                // Filter gallery items based on tag
                const filter = e.target.dataset.tag;
                galleryItems.forEach(item => {
                    if (filter === "all" || item.dataset.galleryTag === filter) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });

                // Reset gallery display properties
                gallery.style.display = "grid";
                gallery.style.height = "auto";
            }
        });
    }

    // Modal Creation Section
    const modal = document.createElement("div");
    modal.className = "modal"; // Apply CSS for modal
    document.body.appendChild(modal);

    // Image display inside the modal
    const modalImage = document.createElement("img");
    modalImage.className = "modal-image";
    modal.appendChild(modalImage);

    // Navigation buttons for modal (Previous and Next)
    const prevButton = document.createElement("button");
    prevButton.textContent = "←";
    prevButton.className = "modal-prev-button";
    modal.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.textContent = "→";
    nextButton.className = "modal-next-button";
    modal.appendChild(nextButton);

    // Close button for modal
    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";
    closeButton.className = "modal-close-button";
    modal.appendChild(closeButton);

    let currentIndex = 0; // Track the currently displayed image index

    // Function to display a specific image in the modal
    const showImage = (index) => {
        modalImage.src = galleryItems[index].src;
        modal.style.display = "flex"; // Show modal
        currentIndex = index;
    };

    // Show the next image in the modal
    const nextImage = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length; // Circular navigation
        showImage(currentIndex);
    };

    // Show the previous image in the modal
    const prevImage = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showImage(currentIndex);
    };

    // Add click events to gallery items to open modal
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => showImage(index));
    });

    // Add event listeners to modal navigation buttons
    nextButton.addEventListener("click", nextImage);
    prevButton.addEventListener("click", prevImage);

    // Close modal on close button click
    closeButton.addEventListener("click", () => (modal.style.display = "none"));

    // Close modal when clicking outside the image
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Add keyboard navigation for modal
    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage(); 
            if (e.key === "Escape") modal.style.display = "none"; 
        }
    });
});
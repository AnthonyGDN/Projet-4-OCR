// Wait for the DOM content to load before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Select the gallery container and all gallery items
    const gallery = document.querySelector(".gallery");
    const galleryItems = document.querySelectorAll(".gallery-item");

    // Create a unique list of tags from the data attributes of gallery items
    const tags = [...new Set([...galleryItems].map(item => item.dataset.galleryTag))];

    // Get the parent container of the gallery
    const container = gallery.parentElement;

    // Set the gallery to display as a grid
    gallery.style.display = "grid";

    let filteredItems = [...galleryItems]; // Initialize with all gallery items
    let currentIndex = 0; // Tracks the current index for modal navigation

    // Check if there are tags to filter
    if (tags.length > 0) {
        // Create a container for the filter buttons
        const tagContainer = document.createElement("div");
        tagContainer.className = "nav nav-pills justify-content-center";
        container.prepend(tagContainer); // Insert the tag container before the gallery

        // Create the "All" button for showing all items
        const allButton = document.createElement("button");
        allButton.className = "nav-link active";
        allButton.textContent = "Tous"; // "Tous" means "All" in French
        allButton.dataset.tag = "all";
        tagContainer.appendChild(allButton);

        // Create buttons for each unique tag
        tags.forEach(tag => {
            const button = document.createElement("button");
            button.className = "nav-link";
            button.textContent = tag; // Set button text as the tag
            button.dataset.tag = tag; // Add data attribute for filtering
            tagContainer.appendChild(button);
        });

        // Add click event listener to the tag container for filtering
        tagContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("nav-link")) {
                // Remove the active class from all buttons and set it to the clicked button
                document.querySelectorAll(".nav-link").forEach((btn) => btn.classList.remove("active"));
                e.target.classList.add("active");

                // Filter items based on the selected tag
                const filter = e.target.dataset.tag;
                filteredItems = Array.from(galleryItems).filter(item =>
                    filter === "all" || item.dataset.galleryTag === filter
                );

                let visibleItems = 0; // Counter for visible items
                galleryItems.forEach((item) => {
                    if (filteredItems.includes(item)) {
                        item.style.display = "block"; // Show item if it matches the filter
                        visibleItems++;
                    } else {
                        item.style.display = "none"; // Hide item if it doesn't match
                    }
                });

                // Adjust the grid layout based on visible items
                if (visibleItems > 0) {
                    gallery.style.gridTemplateRows = `repeat(${Math.ceil(visibleItems / 3)}, auto)`;
                    gallery.style.display = "grid";
                } else {
                    gallery.style.gridTemplateRows = "none";
                    gallery.style.display = "none";
                }

                // Adjust margin of the quote section if it exists
                const quoteSection = document.querySelector(".quote");
                if (quoteSection) {
                    quoteSection.style.marginTop = visibleItems > 0 ? "2em" : "0";
                }
            }
        });
    }

    // Create the modal for displaying full images
    const modal = document.createElement("div");
    modal.className = "modal";
    document.body.appendChild(modal);

    // Add a container inside the modal for the image
    const modalImageContainer = document.createElement("div");
    modalImageContainer.className = "modal-image-container";
    modal.appendChild(modalImageContainer);

    // Create the image element inside the modal
    const modalImage = document.createElement("img");
    modalImage.className = "modal-image";
    modalImageContainer.appendChild(modalImage);

    // Create navigation buttons for the modal (previous, next, close)
    const prevButton = document.createElement("button");
    prevButton.textContent = "←";
    prevButton.className = "modal-prev-button";
    modalImageContainer.appendChild(prevButton);

    const nextButton = document.createElement("button");
    nextButton.textContent = "→";
    nextButton.className = "modal-next-button";
    modalImageContainer.appendChild(nextButton);

    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";
    closeButton.className = "modal-close-button";
    modal.appendChild(closeButton);

    // Function to display the selected image in the modal
    const showImage = (index) => {
        currentIndex = (index + filteredItems.length) % filteredItems.length; // Handle circular navigation
        modalImage.src = filteredItems[currentIndex].src; // Set modal image source
        modal.style.display = "flex"; // Display the modal
    };

    // Add click event listener to each gallery item to open the modal
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentIndex = filteredItems.indexOf(item); // Set current index
            showImage(currentIndex); // Display the selected image
        });
    });

    // Function to navigate to the next image
    let nextImage = () => {
        showImage(currentIndex + 1);
    };

    // Function to navigate to the previous image
    let prevImage = () => {
        showImage(currentIndex - 1);
    };

    // Add event listeners for navigation buttons in the modal
    nextButton.addEventListener("click", nextImage);
    prevButton.addEventListener("click", prevImage);

    // Add event listener to close the modal
    closeButton.addEventListener("click", () => modal.style.display = "none");

    // Close modal if the background (modal itself) is clicked
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Add keyboard support for modal navigation and closing
    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowRight") nextImage(); // Right arrow for next image
            if (e.key === "ArrowLeft") prevImage(); // Left arrow for previous image
            if (e.key === "Escape") modal.style.display = "none"; // Escape key to close modal
        }
    });
});
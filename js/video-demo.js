// ==========================================
// Video Demo Module
// Handles video timestamps and collapsible controls
// ==========================================

(function () {
  'use strict';

  const VideoTimestamps = {
    init() {
      this.iframe = document.querySelector('.video-container iframe');
      this.timestampLinks = document.querySelectorAll('.timestamp-link');
      this.timestampsContainer = document.querySelector('.video-timestamps');
      this.toggleButton = document.querySelector('.timestamps-toggle');

      if (!this.iframe || !this.timestampLinks.length) return;

      // Add toggle functionality
      if (this.toggleButton && this.timestampsContainer) {
        this.toggleButton.addEventListener('click', () => {
          this.timestampsContainer.classList.toggle('expanded');
        });
      }

      // Timestamp click handlers
      this.timestampLinks.forEach(link => {
        link.addEventListener('click', e => this.handleTimestampClick(e));
      });
    },

    handleTimestampClick(e) {
      e.preventDefault();

      const time = e.currentTarget.getAttribute('data-time');
      const baseUrl = 'https://www.youtube-nocookie.com/embed/DVsQg_OBTHs';
      const params = `?si=0TYIEgWdXn4C2aNk&start=${time}&autoplay=1`;

      // Update iframe src to jump to timestamp
      this.iframe.src = baseUrl + params;

      // Update active state
      this.timestampLinks.forEach(link => link.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // Scroll to video if not in view
      const videoSection = document.getElementById('demo');
      if (videoSection) {
        const rect = videoSection.getBoundingClientRect();
        if (rect.top < 0) {
          videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VideoTimestamps.init());
  } else {
    VideoTimestamps.init();
  }
})();

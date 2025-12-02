// ==========================================
// Video Demo Module
// Handles video timestamps and collapsible controls
// ==========================================

(function () {
  'use strict';

  const VideoTimestamps = {
    iframe: null,
    videoLoaded: false,

    init() {
      this.facade = document.getElementById('video-facade');
      this.timestampLinks = document.querySelectorAll('.timestamp-link');
      this.timestampsContainer = document.querySelector('.video-timestamps');
      this.toggleButton = document.querySelector('.timestamps-toggle');

      if (!this.facade || !this.timestampLinks.length) return;

      // Lazy load video on facade click
      const playButton = this.facade.querySelector('.video-play-button');
      if (playButton) {
        playButton.addEventListener('click', () => this.loadVideo());
      }

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

    loadVideo(startTime = 0, autoplay = true) {
      if (this.videoLoaded) return;

      // Show loading spinner
      const spinner = document.createElement('div');
      spinner.className = 'video-loading';
      spinner.innerHTML = '<div class="spinner"></div><p>Loading video...</p>';
      this.facade.innerHTML = '';
      this.facade.appendChild(spinner);

      const videoId = this.facade.getAttribute('data-video-id');
      const params = new URLSearchParams({
        si: '0TYIEgWdXn4C2aNk',
        ...(startTime && { start: startTime }),
        autoplay: 1, // Always autoplay on load
      });

      const iframe = document.createElement('iframe');
      iframe.width = '560';
      iframe.height = '315';
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;

      // Replace spinner with iframe after a brief moment
      setTimeout(() => {
        this.facade.innerHTML = '';
        this.facade.appendChild(iframe);
        this.iframe = iframe;
        this.videoLoaded = true;
      }, 300);
    },

    handleTimestampClick(e) {
      e.preventDefault();

      const time = e.currentTarget.getAttribute('data-time');

      // Load video with timestamp if not loaded yet
      if (!this.videoLoaded) {
        this.loadVideo(time, true);
      } else {
        // Update existing iframe
        const baseUrl = 'https://www.youtube-nocookie.com/embed/DVsQg_OBTHs';
        const params = `?si=0TYIEgWdXn4C2aNk&start=${time}&autoplay=1`;
        this.iframe.src = baseUrl + params;
      }

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

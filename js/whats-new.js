/**
 * What's New Page - Collapse Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // Add collapse functionality to version cards (except latest)
  const versionCards = document.querySelectorAll('.version-card:not(.latest)');

  versionCards.forEach(card => {
    const header = card.querySelector('.version-header');

    header.addEventListener('click', () => {
      card.classList.toggle('collapsed');
    });
  });
});

    const overlay = document.getElementById('overlay');
    const buttons = document.querySelectorAll('.more-info-btn');
    const cards = document.querySelectorAll('.card');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetCard = document.getElementById(targetId);
        // Hide any previously open cards
        cards.forEach(card => card.style.display = 'none');
        // Show overlay and target card
        overlay.style.display = 'flex';
        targetCard.style.display = 'block';
      });
    });
    // Close when overlay background or close icon clicked
    overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('overlay') || e.target.classList.contains('close-btn')) {
        overlay.style.display = 'none';
        cards.forEach(card => card.style.display = 'none');
      }
    });
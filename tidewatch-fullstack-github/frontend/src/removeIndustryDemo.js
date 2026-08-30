function removeIndustryDemoButton() {
  const buttons = Array.from(document.querySelectorAll('button'));
  for (const button of buttons) {
    const text = (button.textContent || '').trim();
    if (
      text.includes('Start Industry Demo') ||
      text.includes('தொழில் டெமோ தொடங்கு') ||
      text.includes('इंडस्ट्री डेमो शुरू करें') ||
      text.includes('ഇൻഡസ്ട്രി ഡെമോ ആരംഭിക്കുക') ||
      text.includes('ఇండస్ట్రీ డెమో ప్రారంభించండి')
    ) {
      button.remove();
    }
  }
}

const observer = new MutationObserver(removeIndustryDemoButton);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', removeIndustryDemoButton);
setTimeout(removeIndustryDemoButton, 100);

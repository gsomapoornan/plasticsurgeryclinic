const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
const treatments = document.querySelector('.care-menu');

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  treatments.open = false;
}
menu.addEventListener('click', () => {
  if (navigation.classList.contains('open')) closeMenu();
  else {
    navigation.classList.add('open');
    menu.setAttribute('aria-expanded', 'true');
  }
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('click', event => {
  if (!event.target.closest('.top')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const wasMobileMenu = navigation.classList.contains('open');
  if (!wasMobileMenu && !treatments.open) return;
  closeMenu();
  if (wasMobileMenu) menu.focus();
  else treatments.querySelector('summary').focus();
});

const playlist = [
  { src: './media/arrival.mp4', focus: '56% 50%' },
  { src: './media/welcome.mp4', focus: '50% 43%' },
  { src: './media/preparation.mp4', focus: '55% 50%' },
  { src: './media/surgery.mp4', focus: '50% 48%' }
];

const video = document.querySelector('.film video');
const playback = document.querySelector('.play');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let clip = 0;

function setClip(index) {
  clip = index;
  const item = playlist[index];
  video.style.setProperty('--frame-focus', item.focus);
  video.src = item.src;
}

function updatePlayback() {
  const playing = !video.paused && !video.ended;
  playback.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  playback.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
}

async function playFilm() {
  if (!video.getAttribute('src')) setClip(0);
  try {
    await video.play();
  } catch {
    updatePlayback();
  }
}

video.addEventListener('ended', () => {
  setClip((clip + 1) % playlist.length);
  playFilm();
});
video.addEventListener('play', updatePlayback);
video.addEventListener('pause', updatePlayback);
video.addEventListener('error', updatePlayback);
playback.addEventListener('click', () => {
  if (video.paused) playFilm();
  else video.pause();
});
motion.addEventListener('change', event => {
  if (event.matches) video.pause();
});
if (!motion.matches && !navigator.connection?.saveData) playFilm();

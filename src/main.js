import { linkPage } from './content.js';

export function usableHref(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim(), 'https://links.nowk.co.kr');
    return ['https:', 'http:'].includes(url.protocol) ? value.trim() : '';
  } catch { return ''; }
}

export function getShareUrl(href) {
  const url = new URL(href);
  url.search = '';
  url.hash = '';
  return url.href;
}

export function renderPage(config, doc = document) {
  const signup = doc.getElementById('signup');
  const signupHref = usableHref(config.signup.href);
  const action = doc.createElement(signupHref ? 'a' : 'button');
  action.className = 'signup-button';
  action.textContent = config.signup.label;
  if (signupHref) action.href = signupHref;
  else { action.type = 'button'; action.disabled = true; }
  signup.replaceChildren(action);
  doc.getElementById('signup-title').textContent = config.signup.title;
  doc.getElementById('signup-description').textContent = config.signup.description;
  const benefits = doc.getElementById('signup-benefits');
  benefits.replaceChildren();
  for (const benefit of config.signup.benefits || []) {
    const row = doc.createElement('li');
    const icon = doc.createElement('img');
    icon.src = `/public/icons/${benefit.icon}.svg`;
    icon.alt = '';
    const text = doc.createElement('span');
    text.textContent = benefit.text;
    row.append(icon, text);
    benefits.append(row);
  }
  doc.getElementById('signup-status').textContent = signupHref ? '' : '가입 링크를 준비하고 있어요.';
  const collaboration = doc.getElementById('collaboration');
  const mailIcon = doc.createElement('span');
  mailIcon.setAttribute('data-icon', 'mail');
  mailIcon.setAttribute('aria-hidden', 'true');
  const collaborationText = doc.createElement('span');
  collaborationText.textContent = config.contact.collaborationLabel;
  collaboration.replaceChildren(mailIcon, collaborationText);
  doc.getElementById('collaboration').href = `mailto:${config.contact.email}?subject=${encodeURIComponent(config.contact.subject)}&body=${encodeURIComponent(config.contact.body.replace(/\r?\n/g, '\r\n'))}`;
  doc.getElementById('store').href = usableHref(config.contact.store);
  doc.getElementById('instagram').href = usableHref(config.contact.instagram);
  doc.getElementById('share-name').textContent = config.profile.name;
  const shareAvatar = doc.getElementById('share-avatar');
  shareAvatar.textContent = config.profile.logoText || config.profile.name;
  const shareBackground = doc.getElementById('share-background');
  shareBackground.hidden = !config.profile.imageSrc;
  if (config.profile.imageSrc) {
    shareBackground.src = config.profile.imageSrc;
    const image = doc.createElement('img');
    image.alt = config.profile.imageAlt;
    image.addEventListener('error', () => { shareAvatar.textContent = config.profile.logoText || config.profile.name; shareBackground.hidden = true; }, { once: true });
    image.src = config.profile.imageSrc;
    shareAvatar.replaceChildren(image);
  }

  doc.getElementById('profile-name').textContent = config.profile.name;
  const bio = doc.getElementById('profile-bio');
  bio.textContent = config.profile.bio.trim();
  bio.hidden = !bio.textContent;
  const frame = doc.getElementById('profile-image');
  const fallback = doc.createElement('span');
  fallback.textContent = config.profile.logoText || config.profile.name;
  fallback.setAttribute('aria-hidden', 'true');
  frame.replaceChildren(fallback);
  if (config.profile.imageSrc.trim()) {
    const img = doc.createElement('img');
    img.alt = config.profile.imageAlt;
    img.addEventListener('error', () => frame.replaceChildren(fallback), { once: true });
    img.addEventListener('load', () => fallback.remove(), { once: true });
    img.src = config.profile.imageSrc;
    frame.append(img);
  }
  renderLinks(config.links, doc.getElementById('links'), doc);
  doc.getElementById('archive-title').textContent = config.archive?.title || '';
  doc.getElementById('archive').hidden = !config.archive?.links?.length;
  renderLinks(config.archive?.links || [], doc.getElementById('archive-links'), doc);
}

function renderLinks(items, links, doc) {
  links.replaceChildren();
  for (const item of items) {
    const href = usableHref(item.href);
    if (!item.label.trim() || !href) continue;
    const anchor = doc.createElement('a');
    anchor.className = 'link-button';
    anchor.href = href;
    anchor.textContent = item.label;
    const content = doc.createElement('span');
    content.className = 'link-content';
    const label = doc.createElement('span');
    label.className = 'link-label';
    label.textContent = item.label;
    content.append(label);
    anchor.replaceChildren(content);
    if (item.layout === 'card' && !item.imageSrc?.trim()) {
      anchor.className = 'link-button link-card';
      const placeholder = doc.createElement('span');
      placeholder.className = 'link-card-placeholder';
      placeholder.setAttribute('aria-hidden', 'true');
      anchor.replaceChildren(placeholder, content);
    }
    if (item.imageSrc?.trim()) {
      const image = doc.createElement('img');
      image.src = item.imageSrc;
      image.alt = item.imageAlt || '';
      image.loading = 'lazy';
      image.addEventListener('error', () => { image.remove(); anchor.className = 'link-button'; }, { once: true });
      anchor.className = item.layout === 'card' ? 'link-button link-card' : 'link-button link-thumbnail';
      anchor.replaceChildren(image, content);
    }
    if (item.caption?.trim()) {
      const caption = doc.createElement('span');
      caption.className = 'link-caption';
      caption.textContent = item.caption;
      content.append(caption);
    }
    links.append(anchor);
  }
}

export async function copyPageUrl(url, { navigator: nav, document: doc }) {
  try {
    if (nav.clipboard?.writeText) { await nav.clipboard.writeText(url); return true; }
  } catch { /* 인앱 브라우저의 클립보드 제한 시 선택 복사로 대체합니다. */ }
  const input = doc.getElementById('share-url');
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);
  try { return doc.execCommand('copy'); } catch { return false; }
}

export function setupInteractions(doc = document, win = window) {
  const shareUrl = getShareUrl(win.location.href);
  let pendingNavigation;
  for (const link of doc.querySelectorAll('.link-button')) {
    link.addEventListener('click', event => {
      if (!win.matchMedia('(hover: none)').matches || win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (pendingNavigation) return;
      link.classList.add('is-tapped');
      const delay = parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue('--link-tap-delay'));
      pendingNavigation = win.setTimeout(() => win.location.assign(link.href), delay);
    });
  }
  win.addEventListener('pageshow', () => {
    win.clearTimeout(pendingNavigation);
    pendingNavigation = undefined;
    for (const link of doc.querySelectorAll('.is-tapped')) link.classList.remove('is-tapped');
  });
  let qr;
  const download = (href, extension) => {
    const link = doc.createElement('a');
    link.href = href;
    link.download = `nowk-qr.${extension}`;
    link.click();
  };
  for (const kind of ['share', 'signup']) {
    const dialog = doc.getElementById(`${kind}-dialog`);
    const trigger = doc.getElementById(`${kind}-open`);
    trigger.addEventListener('click', () => {
      if (kind === 'share') {
        doc.getElementById('share-url').value = shareUrl;
        doc.getElementById('share-address').textContent = shareUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        doc.getElementById('share-status').textContent = '';
        if (typeof win.qrcode === 'function') {
        qr = win.qrcode(0, 'M');
        qr.addData(shareUrl);
        qr.make();
        doc.getElementById('share-qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 16, scalable: true });
        }
        doc.querySelector('.qr-section').hidden = !qr;
      }
      dialog.showModal();
      doc.getElementById(`${kind}-title`).focus({ preventScroll: true });
      doc.body.classList.add('modal-open');
    });
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      doc.body.classList.remove('modal-open');
      trigger.focus();
    });
  }
  const nativeButton = doc.getElementById('native-share');
  doc.getElementById('qr-svg').addEventListener('click', () => {
    const blob = new Blob([qr.createSvgTag({ cellSize: 8, margin: 32 })], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    download(url, 'svg');
    win.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  doc.getElementById('qr-png').addEventListener('click', () => {
    const image = new Image();
    image.onload = () => {
      const canvas = doc.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      download(canvas.toDataURL('image/png'), 'png');
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.createSvgTag({ cellSize: 8, margin: 32 }))}`;
  });
  nativeButton.hidden = !win.navigator.share;
  nativeButton.addEventListener('click', async () => {
    try { await win.navigator.share({ title: linkPage.profile.name, url: shareUrl }); }
    catch (error) { if (error.name !== 'AbortError') doc.getElementById('share-status').textContent = '공유할 수 없어요. 아래 링크 복사를 이용해 주세요.'; }
  });
  doc.getElementById('copy-link').addEventListener('click', async () => {
    const copied = await copyPageUrl(shareUrl, { navigator: win.navigator, document: doc });
    doc.getElementById('share-status').textContent = copied ? '링크를 복사했어요.' : '주소를 길게 눌러 직접 복사해 주세요.';
  });
}

if (typeof document !== 'undefined') {
  renderPage(linkPage);
  setupInteractions();
}

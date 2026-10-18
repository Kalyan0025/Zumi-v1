/* Shared namespace + icon set */
window.Z=window.Z||{};
Z.$=s=>document.querySelector(s);
Z.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
Z.ic=(n,s=20,c='currentColor',w=1.7)=>{const d={
cal:'<rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M4 10h16M9 3.5v4M15 3.5v4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
mic:'<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
right:'<path d="M9.5 6l6 6-6 6"/>',left:'<path d="M14.5 6l-6 6 6 6"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
flash:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
flip:'<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>',
img:'<rect x="4" y="5" width="16" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M5 17l4.5-4.5 3 3L15 13l4 4"/>',
spark:'<path d="M12 3.5l1.7 5.1 5.1 1.7-5.1 1.7L12 17l-1.7-5-5.1-1.7 5.1-1.7zM18.5 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
shift:'<path d="M12 4l8 9h-5v6H9v-6H4z"/>',
del:'<path d="M9 6h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 18H9l-5.5-6z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>',
smile:'<circle cx="12" cy="12" r="8"/><path d="M8.5 14c1 1.6 2.2 2.3 3.5 2.3s2.5-.7 3.5-2.3"/><circle cx="9.3" cy="10" r=".6" fill="currentColor"/><circle cx="14.7" cy="10" r=".6" fill="currentColor"/>'}[n];
return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`};

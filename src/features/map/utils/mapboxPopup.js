export function buildMapPopupNode(pin) {
  const wrapper = document.createElement('div');
  wrapper.className = 'popup-card stack-sm';

  const badge = document.createElement('span');
  badge.className = `pin-badge pin-badge-${pin.type}`;
  badge.textContent = pin.type;
  wrapper.appendChild(badge);

  const header = document.createElement('div');
  const title = document.createElement('h3');
  title.className = 'popup-title';
  title.textContent = pin.title;
  const description = document.createElement('p');
  description.className = 'muted popup-description';
  description.textContent = pin.description;
  header.append(title, description);
  wrapper.appendChild(header);

  const meta = document.createElement('dl');
  meta.className = 'popup-meta';

  const addMetaItem = (label, value) => {
    const item = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    item.append(dt, dd);
    meta.appendChild(item);
  };

  addMetaItem('Category', pin.category);
  addMetaItem('Added by', pin.createdBy || 'Community member');
  addMetaItem('Created', pin.createdAtLabel);

  if (pin.type === 'event') {
    addMetaItem('Date', pin.eventDate || 'TBD');
    addMetaItem('Starts', pin.startTime || 'Not set');
  } else {
    addMetaItem('Pin type', 'Place');
  }

  wrapper.appendChild(meta);
  return wrapper;
}

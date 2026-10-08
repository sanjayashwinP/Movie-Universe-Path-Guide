/**
 * Dynamic Multiverse Date Tracking Engine
 * Accurately tracks current daily dates, calculates dynamic release statuses,
 * days elapsed or remaining, and live countdown timers.
 */

// Current date anchor - uses real client date or defaults to current system date
export const getCurrentDate = () => new Date();

export const getTodayIsoString = () => {
  const now = getCurrentDate();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatCurrentDate = () => {
  const now = getCurrentDate();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'TBA';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateStr;
};

/**
 * Calculates dynamic release status based on current date
 */
export const getDynamicReleaseInfo = (releaseDateStr, rawStatus = 'UPCOMING') => {
  if (!releaseDateStr) {
    return {
      isReleased: false,
      effectiveStatus: rawStatus || 'ANNOUNCED',
      statusLabel: 'Date Pending (TBA)',
      badgeClass: 'badge-purple',
      daysUntil: null,
      daysAgo: null,
      displayNote: 'Official release date pending confirmation'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = releaseDateStr.split('-');
  const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  targetDate.setHours(0, 0, 0, 0);

  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    // Release date is today or in the past
    const daysAgo = Math.abs(diffDays);
    const isVeryRecent = daysAgo <= 30;

    return {
      isReleased: true,
      effectiveStatus: 'RELEASED',
      statusLabel: daysAgo === 0 ? 'Released Today!' : isVeryRecent ? 'Now In Theaters / Released' : 'Released',
      badgeClass: isVeryRecent ? 'badge-emerald' : 'badge-emerald',
      daysUntil: null,
      daysAgo,
      isVeryRecent,
      displayNote: daysAgo === 0 
        ? 'Premiere today!' 
        : `Released ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago (${formatDisplayDate(releaseDateStr)})`
    };
  } else {
    // Future release date
    let label = 'Upcoming Release';
    let badge = 'badge-indigo';

    if (diffDays <= 90) {
      label = `Imminent Release (${diffDays}d left)`;
      badge = 'badge-gold';
    } else if (rawStatus === 'POST_PRODUCTION') {
      label = 'Post-Production';
      badge = 'badge-blue';
    } else if (rawStatus === 'IN_PRODUCTION' || rawStatus === 'FILMING') {
      label = 'In Production / Filming';
      badge = 'badge-purple';
    } else if (rawStatus === 'IN_DEVELOPMENT') {
      label = 'In Development';
      badge = 'badge-warning';
    }

    return {
      isReleased: false,
      effectiveStatus: rawStatus === 'RELEASED' ? 'UPCOMING' : (rawStatus || 'UPCOMING'),
      statusLabel: label,
      badgeClass: badge,
      daysUntil: diffDays,
      daysAgo: null,
      isVeryRecent: false,
      displayNote: `Releasing in ${diffDays} day${diffDays === 1 ? '' : 's'} (${formatDisplayDate(releaseDateStr)})`
    };
  }
};

/**
 * Live Countdown timer calculation for any future date
 */
export const calculateLiveCountdown = (targetDateStr) => {
  if (!targetDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const parts = targetDateStr.split('-');
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
  const now = new Date();

  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false, totalMs: diffMs };
};

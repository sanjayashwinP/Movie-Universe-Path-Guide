import { contentApi, franchiseApi, watchOrderApi, statsApi, recommendationApi } from './api.js';
import { INITIAL_CONTENT, INITIAL_FRANCHISES, INITIAL_UNIVERSES, INITIAL_SAGAS, INITIAL_PHASES, INITIAL_ANNOUNCEMENTS } from './dataSeed.js';
import { getDynamicReleaseInfo, getTodayIsoString } from './dateTracker.js';
import { getAutoIngestedProjects, LIVE_RADAR_PROJECTS } from './radarSyncService.js';
import { getPosterFallback } from '../utils/imageFallback.js';

/**
 * Normalizes any content object with dynamic daily release tracking
 * and ensures official TMDB theatrical posters over any legacy placeholders.
 */
export function normalizeContentItem(item) {
  if (!item) return null;
  const dynamicInfo = getDynamicReleaseInfo(item.releaseDate, item.status);

  // Cross-reference with verified TMDB canon
  const allVerified = [...INITIAL_CONTENT, ...LIVE_RADAR_PROJECTS];
  const seedMatch = allVerified.find(s => 
    s.id === item.id || 
    s.slug === item.slug || 
    s.title?.toLowerCase() === item.title?.toLowerCase()
  );

  let finalPoster = item.posterUrl;
  if (!finalPoster || finalPoster.includes('unsplash.com') || finalPoster.includes('images.unsplash.com')) {
    finalPoster = seedMatch?.posterUrl || getPosterFallback(item.title);
  }

  let finalBackdrop = item.backdropUrl;
  if (!finalBackdrop || finalBackdrop.includes('unsplash.com') || finalBackdrop.includes('images.unsplash.com')) {
    finalBackdrop = seedMatch?.backdropUrl || finalPoster;
  }

  return {
    ...item,
    posterUrl: finalPoster,
    backdropUrl: finalBackdrop,
    releaseOrderNum: item.releaseOrderNum || seedMatch?.releaseOrderNum,
    chronologicalOrderNum: item.chronologicalOrderNum || seedMatch?.chronologicalOrderNum,
    timelineOrderNum: item.timelineOrderNum || seedMatch?.timelineOrderNum,
    keyIntroduction: item.keyIntroduction || seedMatch?.keyIntroduction,
    postCreditScene: item.postCreditScene || seedMatch?.postCreditScene,
    beginnerNotes: item.beginnerNotes || seedMatch?.beginnerNotes,
    effectiveStatus: dynamicInfo.effectiveStatus,
    status: dynamicInfo.effectiveStatus,
    isReleased: dynamicInfo.isReleased,
    daysUntil: dynamicInfo.daysUntil,
    daysAgo: dynamicInfo.daysAgo,
    statusLabel: dynamicInfo.statusLabel,
    badgeClass: dynamicInfo.badgeClass,
    displayNote: dynamicInfo.displayNote
  };
}

export const clientDataService = {
  /**
   * Retrieves all content, either from live API or instant local seed,
   * merged seamlessly with any newly auto-ingested future projects.
   */
  async getAllContent(params = {}) {
    let items = [];

    try {
      const res = await contentApi.getAll(params);
      const apiItems = res.data?.data?.content || res.data?.data || [];
      if (apiItems.length > 0) {
        items = apiItems.map(normalizeContentItem);
      }
    } catch (err) {
      console.warn('API unavailable, serving normalized multiverse dataset:', err.message);
    }

    if (items.length === 0) {
      // Fallback to local verified canon
      items = INITIAL_CONTENT.map(normalizeContentItem);
    }

    // Seamlessly merge any newly auto-ingested future projects
    const autoIngested = getAutoIngestedProjects().map(normalizeContentItem);
    const existingSlugs = new Set(items.map(i => i.slug));
    for (const autoItem of autoIngested) {
      if (!existingSlugs.has(autoItem.slug)) {
        items.push(autoItem);
        existingSlugs.add(autoItem.slug);
      }
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(c => 
        c.title.toLowerCase().includes(q) ||
        (c.castMembers && c.castMembers.toLowerCase().includes(q)) ||
        (c.director && c.director.toLowerCase().includes(q)) ||
        (c.universeName && c.universeName.toLowerCase().includes(q))
      );
    }
    if (params.status) {
      items = items.filter(c => c.status === params.status || c.effectiveStatus === params.status);
    }
    if (params.contentType) {
      items = items.filter(c => c.contentType === params.contentType);
    }
    if (params.universeId) {
      items = items.filter(c => c.universeId === Number(params.universeId));
    }
    if (params.sagaId) {
      items = items.filter(c => c.sagaId === Number(params.sagaId));
    }
    if (params.phaseId) {
      items = items.filter(c => c.phaseId === Number(params.phaseId));
    }

    return items;
  },

  async getContentBySlugOrId(idOrSlug) {
    try {
      const res = await contentApi.getByIdOrSlug(idOrSlug);
      if (res.data?.data) {
        return normalizeContentItem(res.data.data);
      }
    } catch {
      // fallback
    }

    const all = await this.getAllContent();
    const item = all.find(c => c.slug === idOrSlug || String(c.id) === String(idOrSlug));
    return item ? normalizeContentItem(item) : null;
  },

  async getRoadmap(idOrSlug) {
    try {
      const res = await contentApi.getRoadmap(idOrSlug);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('API roadmap call failed, building client fallback roadmap:', err.message);
    }

    const all = await this.getAllContent();
    const target = all.find(c => c.slug === idOrSlug || String(c.id) === String(idOrSlug));
    if (!target) return null;

    // Filter and build local roadmap steps
    const slug = (target.slug || '').toLowerCase();
    let stepSlugs = [];

    if (slug.includes('phoenix') || slug.includes('apocalypse') || slug.includes('days-of-future-past') || slug.includes('first-class')) {
      stepSlugs = ['x-men-first-class-2011', 'x-men-days-of-future-past-2014', 'x-men-apocalypse-2016', 'dark-phoenix-2019'];
    } else if (slug.includes('x-men') || slug.includes('wolverine') || slug.includes('logan') || slug.includes('new-mutants') || slug.includes('deadpool')) {
      if (slug.includes('deadpool-and-wolverine')) {
        stepSlugs = ['x-men-2000', 'deadpool-2016', 'deadpool-2-2018', 'logan-2017', 'loki-season-1', 'deadpool-and-wolverine'];
      } else if (slug.includes('deadpool-2')) {
        stepSlugs = ['x-men-2000', 'deadpool-2016', 'deadpool-2-2018'];
      } else if (slug.includes('deadpool')) {
        stepSlugs = ['x-men-2000', 'deadpool-2016'];
      } else {
        stepSlugs = ['x-men-origins-wolverine-2009', 'x-men-2000', 'x2-2003', 'x-men-the-last-stand-2006', 'the-wolverine-2013', 'x-men-days-of-future-past-2014', 'logan-2017', 'the-new-mutants-2020'];
      }
    } else if (slug.includes('spider-man') || slug.includes('venom')) {
      stepSlugs = ['spider-man-2002', 'spider-man-2-2004', 'spider-man-3-2007', 'the-amazing-spider-man-2012', 'the-amazing-spider-man-2-2014', 'captain-america-civil-war', 'spider-man-homecoming', 'avengers-infinity-war', 'avengers-endgame', 'spider-man-far-from-home', 'spider-man-no-way-home', 'spider-man-brand-new-day'];
    } else if (slug.includes('brave-new-world') || slug.includes('falcon-and-the-winter-soldier') || slug.includes('thunderbolts')) {
      stepSlugs = ['captain-america-the-first-avenger', 'the-avengers', 'captain-america-the-winter-soldier', 'captain-america-civil-war', 'avengers-endgame', 'the-falcon-and-the-winter-soldier', 'captain-america-brave-new-world', 'thunderbolts'];
    } else if (slug.includes('guardians')) {
      stepSlugs = ['guardians-of-the-galaxy', 'guardians-of-the-galaxy-vol-2', 'avengers-infinity-war', 'avengers-endgame', 'the-guardians-of-the-galaxy-holiday-special', 'guardians-of-the-galaxy-vol-3'];
    } else if (slug.includes('ant-man')) {
      stepSlugs = ['ant-man', 'captain-america-civil-war', 'ant-man-and-the-wasp', 'avengers-endgame', 'loki-season-1', 'ant-man-and-the-wasp-quantumania'];
    } else if (slug.includes('thor')) {
      stepSlugs = ['thor', 'the-avengers', 'thor-the-dark-world', 'avengers-age-of-ultron', 'thor-ragnarok', 'avengers-infinity-war', 'avengers-endgame', 'thor-love-and-thunder'];
    } else if (slug.includes('doomsday') || slug.includes('secret-wars')) {
      stepSlugs = ['captain-america-the-first-avenger', 'iron-man', 'the-avengers', 'captain-america-civil-war', 'avengers-infinity-war', 'avengers-endgame', 'wandavision', 'spider-man-no-way-home', 'doctor-strange-in-the-multiverse-of-madness', 'deadpool-and-wolverine', 'the-fantastic-four-first-steps', 'avengers-doomsday', 'avengers-secret-wars'];
    } else {
      stepSlugs = ['captain-america-the-first-avenger', 'iron-man', 'the-avengers', target.slug];
    }

    // Cut off list at target
    const targetIdx = stepSlugs.indexOf(target.slug);
    if (targetIdx >= 0) {
      stepSlugs = stepSlugs.slice(0, targetIdx + 1);
    } else if (!stepSlugs.includes(target.slug)) {
      stepSlugs.push(target.slug);
    }

    const steps = [];
    let runtime = 0;
    for (let i = 0; i < stepSlugs.length; i++) {
      const sSlug = stepSlugs[i];
      const match = all.find(c => c.slug === sSlug) || (sSlug === target.slug ? target : null);
      if (match) {
        runtime += match.runtimeMinutes || 120;
        const isTarget = match.slug === target.slug;
        steps.push({
          stepNumber: i + 1,
          contentId: match.id,
          title: match.title,
          slug: match.slug,
          contentType: match.contentType,
          releaseYear: match.releaseYear,
          releaseDate: match.releaseDate,
          runtimeMinutes: match.runtimeMinutes,
          posterUrl: match.posterUrl,
          universeName: match.universeName,
          universeDesignation: match.universeDesignation,
          timelineName: match.timelineName,
          priority: isTarget ? 'TARGET_DESTINATION' : (i === 0 ? 'CORE_ORIGIN' : 'ESSENTIAL_LORE'),
          reason: isTarget ? 'Target project to watch.' : 'Essential chapter in storyline progression.',
          keyCharacters: match.castMembers || ''
        });
      }
    }

    return {
      targetMovie: target,
      steps,
      totalSteps: steps.length,
      totalWatchTimeMinutes: runtime,
      totalWatchedSteps: 0,
      completionPercentage: 0,
      roadmapType: 'CANONICAL_STORYLINE_ROADMAP',
      narrativeSummary: `Complete chronological roadmap from scratch leading directly into ${target.title}.`
    };
  },

  async getUpcomingSlate() {
    const all = await this.getAllContent();
    const today = getTodayIsoString();

    return all
      .filter(c => !c.isReleased && c.releaseDate && c.releaseDate > today)
      .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  },

  async getRecentReleases(limit = 10) {
    const all = await this.getAllContent();
    const today = getTodayIsoString();

    return all
      .filter(c => c.isReleased || (c.releaseDate && c.releaseDate <= today))
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))
      .slice(0, limit);
  },

  async getFranchises() {
    try {
      const res = await franchiseApi.getAll();
      if (res.data?.data?.length > 0) return res.data.data;
    } catch {}
    return INITIAL_FRANCHISES;
  },

  async getUniverses() {
    return INITIAL_UNIVERSES;
  },

  async getSagas() {
    return INITIAL_SAGAS;
  },

  async getPhases() {
    return INITIAL_PHASES;
  },

  async getAnnouncements() {
    return INITIAL_ANNOUNCEMENTS;
  },

  async getStats() {
    try {
      const res = await statsApi.getOverview();
      if (res.data?.data) return res.data.data;
    } catch {}

    const all = await this.getAllContent();
    const released = all.filter(c => c.isReleased).length;
    return {
      totalContent: all.length,
      releasedCount: released,
      upcomingCount: all.length - released,
      totalHours: Math.round(all.reduce((acc, c) => acc + (c.runtimeMinutes || 0), 0) / 60)
    };
  }
};

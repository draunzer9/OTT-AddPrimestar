/**
 * StreamFlow OTT - Prototype for Share & Earn, Rental Upgrade Prompt & Upgrade Bonus Test
 * Built to spec from PRD: Share & Earn, Rental Upgrade Prompt, Upgrade Bonus Test.md
 * Enhanced with Feature B 5-Day Ad-Free Offer upon renting 3 movies, resetting pool counter to 0.
 */

// Global State
const state = {
  // Current active persona: 'rahul' (Basic, 3 rentals), 'priya' (Referred Friend), 'ananya' (Ad-Free Premium), 'executive' (Dashboard)
  currentPersona: 'rahul',
  
  // A/B Test Arm for Rental Upgrade Prompt: 'arm1' (Prompt only) or 'arm2' (Prompt + Bonus Free Rental)
  abTestArm: 'arm2',
  
  // User profiles
  users: {
    rahul: {
      id: 'USR_RAHUL_882',
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      tier: 'basic', // 'basic' or 'ad-free'
      planType: 'monthly',
      phone: '+91 98765 43210',
      isPhoneOtpVerified: true,
      deviceId: 'DEV_IN_9941A',
      rentalsForAdFreePool: 3, // Counter for Feature B: Rented 3 movies unlocks 5 days ad-free
      hasActive5DayPass: false,
      adFreePassExpires: null,
      rentalsThisMonth: [
        { id: 'm-opp', title: 'Oppenheimer', price: 149, date: '2026-11-02', outsideLibrary: true },
        { id: 'm-spid', title: 'Spider-Man: Across The Multiverse', price: 149, date: '2026-11-05', outsideLibrary: true },
        { id: 'm-mi', title: 'Mission: Impossible - Reckoning', price: 149, date: '2026-11-08', outsideLibrary: true },
      ],
      promptDismissedDate: null, // Null or timestamp
      freeRentalCredits: 0,
      referralStats: {
        sharesCount: 14,
        friendsReferred: [
          { name: 'Priya Verma', status: 'Subscribed (₹149/mo)', date: '12 days ago', vestingDaysLeft: 18, vested: false, rewardType: 'subscription_bonus', amount: 20 },
          { name: 'Amit Saxena', status: 'Basic Active (Ad tier)', date: '34 days ago', vestingDaysLeft: 0, vested: true, rewardType: 'ad_rev_share', amount: 18 },
          { name: 'Rohan Joshi', status: 'Basic Active (Ad tier)', date: '21 days ago', vestingDaysLeft: 9, vested: false, rewardType: 'ad_rev_share', amount: 18 },
          { name: 'Sneha Patel', status: 'Subscribed (₹149/mo)', date: '40 days ago', vestingDaysLeft: 0, vested: true, rewardType: 'subscription_bonus', amount: 20 },
        ],
        monthlyCap: 300,
        accruedThisMonth: 140, // Sum of earned this month towards ₹300 cap
        vestedBalance: 98,
        pendingVestingBalance: 42
      }
    },
    priya: {
      id: 'USR_PRIYA_912',
      name: 'Priya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      tier: 'non-subscriber', // 'non-subscriber', 'basic', or 'ad-free'
      planType: null,
      phone: '+91 98201 54321',
      isPhoneOtpVerified: false,
      deviceId: 'DEV_IN_4118B',
      referredBy: 'USR_RAHUL_882',
      referredByName: 'Rahul Sharma',
      rentalsForAdFreePool: 0,
      hasActive5DayPass: false,
      adFreePassExpires: null,
      rentalsThisMonth: [],
      promptDismissedDate: null,
      freeRentalCredits: 0,
      referralStats: {
        sharesCount: 0,
        friendsReferred: [],
        monthlyCap: 300,
        accruedThisMonth: 0,
        vestedBalance: 0,
        pendingVestingBalance: 0
      }
    },
    ananya: {
      id: 'USR_ANANYA_304',
      name: 'Ananya Iyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      tier: 'ad-free',
      planType: 'annual', // Saved ₹298 via 'Pay 10 mo get 12'
      phone: '+91 97110 88291',
      isPhoneOtpVerified: true,
      deviceId: 'DEV_IN_7720C',
      rentalsForAdFreePool: 0,
      hasActive5DayPass: false,
      adFreePassExpires: null,
      rentalsThisMonth: [
        { id: 'm-opp', title: 'Oppenheimer', price: 149, date: '2026-11-01', outsideLibrary: true }
      ],
      promptDismissedDate: null,
      freeRentalCredits: 1,
      referralStats: {
        sharesCount: 6,
        friendsReferred: [
          { name: 'Kavita Rao', status: 'Subscribed', date: '35 days ago', vestingDaysLeft: 0, vested: true, rewardType: 'subscription_bonus', amount: 20 }
        ],
        monthlyCap: 300,
        accruedThisMonth: 60,
        vestedBalance: 60,
        pendingVestingBalance: 0
      }
    }
  },

  // Titles Catalog
  titles: [
    {
      id: 'brahmastra2',
      title: 'Brahmāstra: Part Two - Dev',
      tagline: 'The Astraverse expands with ancient cosmic weapons and destiny.',
      genre: 'Mythological Fantasy • Action',
      duration: '2h 45m',
      year: '2026',
      rating: '8.4',
      badge: 'Trending #1',
      tierType: 'basic_included',
      rentalPrice: null,
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      description: 'Shiva journeys deeper into the origins of Brahmāstra as Dev rises with insurmountable celestial might.'
    },
    {
      id: 'kantara-legend',
      title: 'Kantara: A Legend Unfolds',
      tagline: 'The divine forest spirit returns to claim what belongs to nature.',
      genre: 'Folklore Thriller • Drama',
      duration: '2h 30m',
      year: '2026',
      rating: '8.9',
      badge: 'New Release Rental',
      tierType: 'tvod_new_release',
      rentalPrice: 199,
      licensingCost: 60,
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1600&q=80',
      description: 'An untamed coastal warrior embarks on a mystic battle between mortal greed and divine wrath.'
    },
    {
      id: 'family-man-3',
      title: 'The Family Man: Season 3',
      tagline: 'World-class espionage, domestic budget dilemmas.',
      genre: 'Espionage Thriller • Comedy',
      duration: '8 Episodes',
      year: '2026',
      rating: '8.8',
      badge: 'Original Series',
      tierType: 'basic_included',
      rentalPrice: null,
      poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      description: 'Srikant Tiwari faces an unprecedented geopolitical crisis threatening the northern frontier while negotiating a home loan.'
    },
    {
      id: 'fighter-air',
      title: 'Fighter: Air Strike',
      tagline: 'Courage under fire at 40,000 feet above the clouds.',
      genre: 'Aerial Action • War',
      duration: '2h 20m',
      year: '2026',
      rating: '7.9',
      badge: 'TVOD Rental',
      tierType: 'tvod_rental',
      rentalPrice: 149,
      licensingCost: 50,
      poster: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e60b?auto=format&fit=crop&w=1600&q=80',
      description: 'India’s elite Air Dragons team coordinates a classified high-altitude supersonic interception.'
    },
    {
      id: 'dunki-journey',
      title: 'Dunki: The Journey Home',
      tagline: 'A heartfelt journey through borders and friendships.',
      genre: 'Comedy • Adventure • Drama',
      duration: '2h 40m',
      year: '2025',
      rating: '7.7',
      badge: 'Included with Ads',
      tierType: 'basic_included',
      rentalPrice: null,
      poster: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      description: 'Four dreamers from a small Punjab village attempt the perilous donkey flight journey to London.'
    },
    {
      id: 'farzi-reload',
      title: 'Farzi: Counterfeit Empire',
      tagline: 'Art, ambition, and printing infinite currency.',
      genre: 'Crime Drama • Thriller',
      duration: 'Season 2',
      year: '2026',
      rating: '8.6',
      badge: 'Included with Ads',
      tierType: 'basic_included',
      rentalPrice: null,
      poster: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      description: 'Sunny takes his artisan counterfeit techniques international while the Special Task Force closes in.'
    }
  ],

  // Active Video Player state
  activePlayer: {
    isOpen: false,
    titleObj: null,
    isPlaying: false,
    isAdPlaying: false,
    adTimeLeft: 10,
    adCanSkip: false,
    videoProgress: 0
  },

  // Active Modals
  modals: {
    shareModal: { isOpen: false, titleObj: null },
    rentalPromptModal: { isOpen: false },
    paywallModal: { isOpen: false, planSelected: 'monthly', otpStep: false, otpCode: '', isVerified: false },
    walletDrawer: { isOpen: false },
    telemetryDrawer: { isOpen: false },
    pilotDashboardModal: { isOpen: false }
  },

  // Telemetry Event Log
  eventLogs: [],

  // Live Scenario Simulator inputs (matching PRD Section 9)
  simulator: {
    adArpu: 40,
    adFreePrice: 149,
    churnRate: 0.08,
    monthsReferredFriendStays: 3,
    licensingCostPerBonus: 60,
    sharesPerMonth: 10,
    promptArm1Rate: 0.04,
    promptArm2Rate: 0.05,
    eligiblePromptUsers: 5000,
    usersPerArm: 2000
  }
};

/**
 * Event Tracking Dispatcher (Compliant with PRD Section 5 & 6)
 */
function trackEvent(eventName, payload = {}) {
  const event = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toLocaleTimeString(),
    fullIso: new Date().toISOString(),
    event: eventName,
    persona: state.currentPersona,
    userId: state.users[state.currentPersona]?.id || 'ANONYMOUS',
    arm: state.abTestArm,
    data: payload
  };

  state.eventLogs.unshift(event);
  if (state.eventLogs.length > 100) state.eventLogs.pop();
  
  console.log(`[TELEMETRY] ${eventName}:`, event);
  renderTelemetryLogs();
  updateTelemetryBadge();
}

/**
 * UI Notification Toast
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClasses = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
    info: 'bg-slate-900/95 border-cyan-500/50 text-cyan-200',
    purple: 'bg-purple-950/90 border-purple-500/50 text-purple-200'
  }[type] || 'bg-slate-900/95 border-slate-700 text-slate-200';

  toast.className = `p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-center space-x-3 text-sm transform transition-all duration-300 translate-y-2 opacity-0 ${bgClasses}`;
  toast.innerHTML = `
    <div class="flex-shrink-0">
      ${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : '⚡'}
    </div>
    <div class="flex-1 font-medium">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/**
 * Persona Switcher Logic
 */
function switchPersona(personaKey) {
  state.currentPersona = personaKey;
  const user = state.users[personaKey];

  if (personaKey === 'priya') {
    trackEvent('link_opened', {
      referredBy: user.referredBy,
      title: 'brahmastra2',
      source: 'whatsapp_share'
    });
    showToast(`Switched to Priya (Referred by Rahul). Referral tracked: ${user.referredBy}`, 'info');
  } else if (personaKey === 'rahul') {
    showToast('Switched to Rahul Sharma (Basic Ad Tier • 3 Rentals in Pool)', 'info');
  } else if (personaKey === 'ananya') {
    showToast('Switched to Ananya Iyer (Ad-Free Annual Subscriber)', 'purple');
  }

  renderApp();
}

/**
 * Switch A/B Test Arm (Feature C)
 */
function setAbTestArm(armKey) {
  state.abTestArm = armKey;
  showToast(`A/B Test set to: ${armKey === 'arm1' ? 'Arm 1 (Prompt Only)' : 'Arm 2 (Prompt + Free Rental Bonus)'}`, 'info');
  renderTopSimulationBar();
}

/**
 * Feature B: Rental-Based 5-Day Ad-Free Offer
 * "You have rented 3 movies so you will get an offer that watch ad-free for 5 days.
 * After activating the offer counter becomes 0 in the pool of rented movies against getting the ad-free offer."
 */
function checkAndTriggerRentalPrompt(forceShow = false) {
  const currentUser = state.users[state.currentPersona];
  if (!currentUser) return;

  if (currentUser.tier === 'ad-free') {
    if (forceShow) {
      showToast('Permanent Ad-free subscribers never see the rental upgrade prompt.', 'warning');
    }
    return;
  }

  const poolCount = currentUser.rentalsForAdFreePool ?? 0;
  const eligibleRentals = currentUser.rentalsThisMonth.filter(r => r.outsideLibrary);
  const totalSpent = eligibleRentals.reduce((sum, r) => sum + r.price, 0);

  if (poolCount < 3 && !forceShow) {
    showToast(`Pool counter: ${poolCount}/3 rented movies. Rent ${3 - poolCount} more to unlock 5 Days Ad-Free!`, 'info');
    return;
  }

  if (currentUser.promptDismissedDate && !forceShow) {
    const daysSinceDismissal = Math.floor((Date.now() - currentUser.promptDismissedDate) / (1000 * 60 * 60 * 24));
    if (daysSinceDismissal < 30) {
      showToast(`Prompt suppressed: User dismissed prompt ${daysSinceDismissal} days ago (30-day cooldown).`, 'warning');
      return;
    }
  }

  state.modals.rentalPromptModal.isOpen = true;
  trackEvent('ad_free_5day_offer_shown', {
    poolCount,
    totalSpent,
    arm: state.abTestArm,
    hasBonus: state.abTestArm === 'arm2'
  });

  renderRentalPromptModal();
}

/**
 * Activate 5 Days Ad-Free Offer & Reset Pool Counter to 0
 */
function activateAdFree5DaysOffer() {
  const currentUser = state.users[state.currentPersona];
  if (!currentUser) return;

  const previousCount = currentUser.rentalsForAdFreePool || 0;
  
  // 1. Reset counter in the pool of rented movies against getting the ad-free offer to 0
  currentUser.rentalsForAdFreePool = 0;
  
  // 2. Grant 5 days ad-free pass
  const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
  currentUser.hasActive5DayPass = true;
  currentUser.adFreePassExpires = Date.now() + fiveDaysMs;
  
  state.modals.rentalPromptModal.isOpen = false;

  trackEvent('ad_free_5day_offer_activated', {
    userId: currentUser.id,
    previousPoolCount: previousCount,
    newPoolCount: 0,
    durationDays: 5,
    expiresAt: new Date(currentUser.adFreePassExpires).toLocaleString()
  });

  if (window.confetti) {
    window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }

  showToast('🎉 5 Days of Ad-Free Viewing ACTIVATED! Rented movies counter reset to 0 in your reward pool.', 'success');
  renderApp();
}

/**
 * Rent a movie from catalog, adding +1 to pool counter
 */
function rentMovie(titleId) {
  const currentUser = state.users[state.currentPersona];
  const movie = state.titles.find(t => t.id === titleId) || state.titles[1];

  currentUser.rentalsThisMonth.unshift({
    id: 'm-' + Date.now(),
    title: movie.title,
    price: movie.rentalPrice || 149,
    date: new Date().toISOString().split('T')[0],
    outsideLibrary: true
  });

  currentUser.rentalsForAdFreePool = (currentUser.rentalsForAdFreePool || 0) + 1;

  trackEvent('movie_rented', {
    title: movie.title,
    price: movie.rentalPrice || 149,
    newPoolCount: currentUser.rentalsForAdFreePool
  });

  showToast(`🎬 Rented "${movie.title}" for ₹${movie.rentalPrice || 149}! Pool progress: ${currentUser.rentalsForAdFreePool}/3 towards 5 Days Ad-Free.`, 'success');

  if (currentUser.rentalsForAdFreePool >= 3) {
    setTimeout(() => {
      checkAndTriggerRentalPrompt(true);
    }, 600);
  } else {
    renderApp();
  }
}

/**
 * Handle Rental Prompt Dismissal
 */
function dismissRentalPrompt() {
  const currentUser = state.users[state.currentPersona];
  currentUser.promptDismissedDate = Date.now();
  state.modals.rentalPromptModal.isOpen = false;

  trackEvent('prompt_dismissed', {
    arm: state.abTestArm,
    cooldownDays: 30
  });

  showToast('Prompt dismissed. Suppressed for 30 days.', 'info');
  renderRentalPromptModal();
}

/**
 * Handle Rental Prompt "Upgrade Now" Click (Permanent Plan)
 */
function clickUpgradeFromPrompt() {
  state.modals.rentalPromptModal.isOpen = false;
  trackEvent('prompt_clicked', {
    arm: state.abTestArm,
    source: 'rental_upgrade_modal'
  });

  openPaywallModal('rental_prompt_conversion');
}

/**
 * Open Paywall / Subscription Screen
 */
function openPaywallModal(source = 'direct') {
  state.modals.paywallModal.isOpen = true;
  state.modals.paywallModal.planSelected = 'monthly';
  state.modals.paywallModal.otpStep = false;
  state.modals.paywallModal.otpCode = '';
  state.modals.paywallModal.isVerified = state.users[state.currentPersona]?.isPhoneOtpVerified || false;

  trackEvent('paywall_shown', {
    source: source,
    currentTier: state.users[state.currentPersona]?.tier,
    abArm: state.abTestArm
  });

  renderPaywallModal();
}

/**
 * Complete Subscription Flow
 */
function completeSubscription() {
  const user = state.users[state.currentPersona];
  const isAnnual = state.modals.paywallModal.planSelected === 'annual';
  const pricePaid = isAnnual ? 1490 : 149;
  const planType = isAnnual ? 'annual' : 'monthly';

  trackEvent('subscription_started', {
    planType,
    pricePaid,
    paymentMethod: 'UPI_PhonePe',
    deviceId: user.deviceId
  });

  user.tier = 'ad-free';
  user.planType = planType;
  user.isPhoneOtpVerified = true;

  let bonusApplied = false;
  if (state.abTestArm === 'arm2') {
    user.freeRentalCredits = (user.freeRentalCredits || 0) + 1;
    bonusApplied = true;
  }

  trackEvent('subscription_completed', {
    planType,
    pricePaid,
    referredBy: user.referredBy || null,
    bonusGranted: bonusApplied ? '1_free_new_release_rental' : null
  });

  if (user.referredBy === 'USR_RAHUL_882') {
    const rahul = state.users.rahul;
    const bonusAmount = 20;
    rahul.referralStats.accruedThisMonth = Math.min(rahul.referralStats.monthlyCap, rahul.referralStats.accruedThisMonth + bonusAmount);
    rahul.referralStats.pendingVestingBalance += bonusAmount;
    
    const existingFriend = rahul.referralStats.friendsReferred.find(f => f.name === user.name);
    if (existingFriend) {
      existingFriend.status = `Subscribed (₹${pricePaid})`;
      existingFriend.vestingDaysLeft = 30;
      existingFriend.vested = false;
      existingFriend.rewardType = 'subscription_bonus';
      existingFriend.amount = bonusAmount;
    } else {
      rahul.referralStats.friendsReferred.unshift({
        name: user.name,
        status: `Subscribed (₹${pricePaid})`,
        date: 'Just now',
        vestingDaysLeft: 30,
        vested: false,
        rewardType: 'subscription_bonus',
        amount: bonusAmount
      });
    }

    trackEvent('reward_accrued', {
      referrerId: rahul.id,
      friendId: user.id,
      rewardType: 'subscription_bonus',
      amount: bonusAmount,
      vestingDays: 30
    });
  }

  state.modals.paywallModal.isOpen = false;

  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  showToast(`🎉 Welcome to Ad-Free! You subscribed to ${planType === 'annual' ? 'Annual (Saved ₹298)' : 'Monthly ₹149'}. ${bonusApplied ? '🎁 1 Free New-Release Rental credited!' : ''}`, 'success');

  renderApp();
}

/**
 * Open Share & Earn Modal for a Title (Feature A)
 */
function openShareModal(titleId) {
  const titleObj = state.titles.find(t => t.id === titleId) || state.titles[0];
  state.modals.shareModal.isOpen = true;
  state.modals.shareModal.titleObj = titleObj;

  const user = state.users[state.currentPersona];
  const referralLink = `https://streamflow.ott/watch?v=${titleObj.id}&ref=${user.id}`;

  trackEvent('link_created', {
    titleId: titleObj.id,
    titleName: titleObj.title,
    referralLink,
    referrerId: user.id
  });

  renderShareModal();
}

function copyReferralLink() {
  const input = document.getElementById('referral-url-input');
  if (input) {
    input.select();
    navigator.clipboard?.writeText(input.value);
    showToast('Referral link copied to clipboard!', 'success');
  }
}

function simulateWhatsAppShare() {
  const titleObj = state.modals.shareModal.titleObj;
  const user = state.users[state.currentPersona];
  const text = `Hey! Watch "${titleObj.title}" on StreamFlow: https://streamflow.ott/watch?v=${titleObj.id}&ref=${user.id}`;
  
  showToast(`Simulated WhatsApp invite sent for "${titleObj.title}"!`, 'success');
  trackEvent('link_shared', { channel: 'whatsapp', text });
  state.modals.shareModal.isOpen = false;
  renderShareModal();
}

/**
 * Video Player Simulation
 */
function openVideoPlayer(titleId) {
  const titleObj = state.titles.find(t => t.id === titleId) || state.titles[0];
  const user = state.users[state.currentPersona];

  if (user.tier === 'non-subscriber') {
    showToast(`Non-subscribers must subscribe before playback. Opening paywall with referral tracking (${user.referredBy}).`, 'info');
    openPaywallModal('video_playback_gate');
    return;
  }

  const isAdFree = user.tier === 'ad-free' || (user.hasActive5DayPass && user.adFreePassExpires > Date.now());

  state.activePlayer.isOpen = true;
  state.activePlayer.titleObj = titleObj;
  state.activePlayer.isPlaying = true;
  state.activePlayer.videoProgress = 0;

  if (!isAdFree) {
    state.activePlayer.isAdPlaying = true;
    state.activePlayer.adTimeLeft = 10;
    state.activePlayer.adCanSkip = false;
    startAdCountdown();
  } else {
    state.activePlayer.isAdPlaying = false;
  }

  renderVideoPlayerModal();
}

let adInterval = null;
function startAdCountdown() {
  if (adInterval) clearInterval(adInterval);

  adInterval = setInterval(() => {
    if (!state.activePlayer.isOpen || !state.activePlayer.isAdPlaying) {
      clearInterval(adInterval);
      return;
    }

    state.activePlayer.adTimeLeft -= 1;
    if (state.activePlayer.adTimeLeft <= 5) {
      state.activePlayer.adCanSkip = true;
    }

    if (state.activePlayer.adTimeLeft <= 0) {
      completeAdBreak();
    } else {
      updateAdPlayerUI();
    }
  }, 1000);
}

function completeAdBreak() {
  if (adInterval) clearInterval(adInterval);
  state.activePlayer.isAdPlaying = false;

  const currentUser = state.users[state.currentPersona];
  
  trackEvent('ad_view_completed', {
    titleId: state.activePlayer.titleObj?.id,
    adDuration: '15s',
    viewerId: currentUser.id,
    referredBy: currentUser.referredBy || null,
    adRevenueGenerated: '₹0.50'
  });

  if (currentUser.referredBy === 'USR_RAHUL_882') {
    const rahul = state.users.rahul;
    rahul.referralStats.accruedThisMonth = Math.min(rahul.referralStats.monthlyCap, rahul.referralStats.accruedThisMonth + 18);
    
    trackEvent('reward_accrued', {
      referrerId: rahul.id,
      friendId: currentUser.id,
      rewardType: 'ad_rev_share_15pct',
      amount: 18,
      status: 'pending_30d_vesting'
    });

    showToast(`Ad finished! Referrer Rahul credited with 15% ad revenue share (₹18 projected)!`, 'success');
  } else {
    showToast('Ad completed. Content resuming in high definition.', 'info');
  }

  updateAdPlayerUI();
}

function closeVideoPlayer() {
  if (adInterval) clearInterval(adInterval);
  state.activePlayer.isOpen = false;
  state.activePlayer.isPlaying = false;
  state.activePlayer.isAdPlaying = false;
  renderVideoPlayerModal();
}

function simulateVestingReward(friendName) {
  const rahul = state.users.rahul;
  const friend = rahul.referralStats.friendsReferred.find(f => f.name === friendName);
  if (!friend) return;

  friend.vestingDaysLeft = 0;
  friend.vested = true;
  rahul.referralStats.vestedBalance += friend.amount;
  rahul.referralStats.pendingVestingBalance = Math.max(0, rahul.referralStats.pendingVestingBalance - friend.amount);

  trackEvent('reward_vested', {
    friendName: friend.name,
    amount: friend.amount,
    rule: '30_days_active_vesting_satisfied'
  });

  showToast(`🎉 Reward vested! ₹${friend.amount} from ${friend.name} moved to Available Vested Balance.`, 'success');
  renderWalletDrawer();
}

function redeemFreeRental(titleId) {
  const user = state.users[state.currentPersona];
  const title = state.titles.find(t => t.id === titleId);

  if (!user.freeRentalCredits || user.freeRentalCredits < 1) {
    showToast('No free rental credits available. Upgrade to unlock bonus!', 'warning');
    return;
  }

  user.freeRentalCredits -= 1;
  trackEvent('bonus_rental_redeemed', {
    titleId: title.id,
    titleName: title.title,
    originalPrice: title.rentalPrice,
    costToPlatform: title.licensingCost || 60
  });

  if (window.confetti) {
    window.confetti({ particleCount: 70, spread: 60 });
  }

  showToast(`🎬 "${title.title}" unlocked for FREE using your Pilot Upgrade Bonus Voucher!`, 'success');
  renderApp();
  openVideoPlayer(title.id);
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================

function renderTopSimulationBar() {
  const el = document.getElementById('top-simulation-bar');
  if (!el) return;

  const current = state.currentPersona;
  const user = state.users[current];

  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
      <!-- Persona Switcher -->
      <div class="flex items-center space-x-2">
        <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
          Active Persona:
        </span>
        <div class="inline-flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          <button onclick="switchPersona('rahul')" class="px-3 py-1 rounded-md transition font-medium ${current === 'rahul' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
            Rahul (Basic • Pool: ${user.rentalsForAdFreePool ?? 0}/3)
          </button>
          <button onclick="switchPersona('priya')" class="px-3 py-1 rounded-md transition font-medium ${current === 'priya' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
            Priya (Referred Friend)
          </button>
          <button onclick="switchPersona('ananya')" class="px-3 py-1 rounded-md transition font-medium ${current === 'ananya' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
            Ananya (Ad-Free Annual)
          </button>
        </div>
      </div>

      <!-- Feature C A/B Arm Controls -->
      <div class="flex items-center space-x-2">
        <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">A/B Test Arm:</span>
        <div class="inline-flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          <button onclick="setAbTestArm('arm1')" class="px-2.5 py-1 rounded-md transition ${state.abTestArm === 'arm1' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-white'}">
            Arm 1: Prompt Only
          </button>
          <button onclick="setAbTestArm('arm2')" class="px-2.5 py-1 rounded-md transition ${state.abTestArm === 'arm2' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'}">
            Arm 2: Prompt + Bonus Rental
          </button>
        </div>
      </div>

      <!-- Quick Action Simulation Triggers -->
      <div class="flex items-center space-x-2">
        <button onclick="rentMovie('fighter-air')" class="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-600/50 font-medium flex items-center space-x-1 transition">
          <span>🎬 + Rent Movie (+1 to Pool)</span>
        </button>
        <button onclick="checkAndTriggerRentalPrompt(true)" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center space-x-1 transition">
          <span>⚡ Test 5-Day Ad-Free Offer</span>
        </button>
        <button onclick="openPilotDashboard()" class="px-2.5 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-700/60 font-medium flex items-center space-x-1 transition">
          <span>📊 PRD Metrics & Simulator</span>
        </button>
        <button onclick="toggleTelemetryDrawer()" class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-medium flex items-center space-x-1 transition">
          <span>📡 Event Stream</span>
          <span id="telemetry-badge" class="ml-1 px-1.5 py-0.2 bg-rose-500/80 text-white rounded-full text-[10px]">0</span>
        </button>
      </div>
    </div>
  `;
}

function renderNavbar() {
  const el = document.getElementById('main-navbar');
  if (!el) return;

  const current = state.currentPersona;
  const user = state.users[current];
  const is5DayActive = user.hasActive5DayPass && user.adFreePassExpires > Date.now();

  el.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-2 cursor-pointer" onclick="renderApp()">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center font-black text-white text-xl shadow-lg glow-red">
              S
            </div>
            <span class="brand-font text-2xl font-black tracking-tight text-white">Stream<span class="text-rose-500">Flow</span></span>
            <span class="text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-semibold">Pilot PRD</span>
          </div>

          <nav class="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
            <a href="#browse" class="hover:text-white transition">Home</a>
            <a href="#movies" class="hover:text-white transition">Movies</a>
            <a href="#tvod" class="hover:text-white transition">Rentals Store (TVOD)</a>
            <a href="#my-rentals" class="hover:text-white transition flex items-center space-x-1.5">
              <span>My Rentals</span>
              ${user.rentalsThisMonth.length > 0 ? `<span class="px-1.5 py-0.2 bg-amber-500/30 text-amber-300 rounded text-xs">${user.rentalsThisMonth.length}</span>` : ''}
            </a>
          </nav>
        </div>

        <!-- Right Side: Wallet, Tier Badge & Profile -->
        <div class="flex items-center space-x-3">
          <!-- Pool counter pill -->
          ${user.tier === 'basic' ? `
            <button onclick="checkAndTriggerRentalPrompt(true)" class="px-3 py-1.5 rounded-xl ${is5DayActive ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-amber-300'} border text-xs font-semibold flex items-center space-x-1.5 transition">
              <span>${is5DayActive ? '⚡ 5-Day Ad-Free Active' : `🎬 Reward Pool: ${user.rentalsForAdFreePool ?? 0}/3`}</span>
            </button>
          ` : ''}

          <!-- Share & Earn Button -->
          <button onclick="toggleWalletDrawer()" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/20 hover:from-emerald-600/40 hover:to-teal-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center space-x-2 transition shadow-sm">
            <span>🎁 Share & Earn</span>
            <span class="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold">₹${user.referralStats.accruedThisMonth}</span>
          </button>

          <!-- Plan Badge -->
          ${user.tier === 'ad-free' ? `
            <div class="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center space-x-1.5">
              <span class="text-amber-400">👑</span>
              <span>Ad-Free VIP</span>
            </div>
          ` : user.tier === 'basic' ? `
            <button onclick="openPaywallModal('nav_badge')" class="px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 hover:bg-amber-900/60 transition">
              <span>Basic (With Ads)</span>
            </button>
          ` : `
            <button onclick="openPaywallModal('nav_cta')" class="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition glow-red">
              Subscribe Now
            </button>
          `}

          <!-- User Profile -->
          <div class="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full border border-slate-700 object-cover" />
            <div class="hidden sm:block text-left">
              <div class="text-xs font-semibold text-slate-200 leading-tight">${user.name.split(' ')[0]}</div>
              <div class="text-[10px] text-slate-400 capitalize">${user.tier.replace('-', ' ')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHeroSection() {
  const el = document.getElementById('hero-section');
  if (!el) return;

  const heroMovie = state.titles[0];
  const user = state.users[state.currentPersona];

  el.innerHTML = `
    <div class="relative w-full h-[540px] overflow-hidden rounded-3xl mx-auto max-w-7xl my-4 border border-slate-800 shadow-2xl">
      <img src="${heroMovie.backdrop}" alt="${heroMovie.title}" class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.1] scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>

      <div class="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl z-10">
        <div class="flex items-center space-x-3 mb-3">
          <span class="px-2.5 py-1 bg-rose-600/90 text-white font-bold text-xs rounded-lg uppercase tracking-wider">
            ${heroMovie.badge}
          </span>
          <span class="px-2.5 py-1 bg-slate-900/80 text-amber-400 font-semibold text-xs rounded-lg border border-slate-700 flex items-center space-x-1">
            <span>★</span>
            <span>${heroMovie.rating}</span>
          </span>
          <span class="text-slate-300 text-xs">${heroMovie.genre}</span>
          <span class="text-slate-400 text-xs">• ${heroMovie.duration}</span>
        </div>

        <h1 class="brand-font text-4xl md:text-5xl font-black text-white leading-tight mb-3">
          ${heroMovie.title}
        </h1>

        <p class="text-slate-300 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
          ${heroMovie.description}
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <button onclick="openVideoPlayer('${heroMovie.id}')" class="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center space-x-2 transition shadow-lg glow-red">
            <span>▶</span>
            <span>Watch Full Movie</span>
          </button>

          <button onclick="openShareModal('${heroMovie.id}')" class="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 font-bold text-sm flex items-center space-x-2 transition shadow-md hover:border-emerald-400">
            <span>🔗</span>
            <span>Share & Earn ₹₹₹</span>
          </button>
        </div>

        <div class="mt-4 flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 w-fit">
          <span class="text-emerald-400">✦</span>
          <span>Earn <strong>15% Ad Revenue</strong> on friend views + <strong>₹20 Flat</strong> on subscriptions</span>
        </div>
      </div>

      ${user.referredBy ? `
        <div class="absolute top-6 right-6 max-w-sm glass-modal p-4 rounded-2xl border border-cyan-500/40 text-left z-20">
          <div class="flex items-center space-x-2 text-xs text-cyan-400 font-bold mb-1">
            <span>👋</span>
            <span>Referred by ${user.referredByName}</span>
          </div>
          <p class="text-xs text-slate-300">
            Your friend shared this title with you! Subscribe to unlock ad-free streaming.
          </p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderContentRows() {
  const el = document.getElementById('content-catalog');
  if (!el) return;

  const user = state.users[state.currentPersona];
  const includedTitles = state.titles.filter(t => t.tierType === 'basic_included');
  const rentalTitles = state.titles.filter(t => t.tierType !== 'basic_included');
  const poolCount = user.rentalsForAdFreePool ?? 0;
  const is5DayActive = user.hasActive5DayPass && user.adFreePassExpires > Date.now();

  el.innerHTML = `
    <!-- FEATURE B 5-DAY AD-FREE OFFER BANNER -->
    ${user.tier === 'basic' ? `
      <div class="my-8 max-w-7xl mx-auto px-4">
        <div class="rounded-2xl ${poolCount >= 3 ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-emerald-500/50 glow-emerald' : is5DayActive ? 'bg-slate-900/90 border-emerald-500/40' : 'bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-rose-950/70 border-amber-500/40'} border p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="z-10">
            <div class="flex items-center space-x-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full ${poolCount >= 3 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'} border text-[11px] font-bold uppercase tracking-wider">
                Feature B: Rented Movies Pool (${poolCount}/3)
              </span>
              <span class="text-xs text-slate-400">Rent 3 movies ➔ Get 5 Days Ad-Free</span>
            </div>
            
            ${poolCount >= 3 ? `
              <h3 class="brand-font text-2xl font-bold text-white mb-1">
                🎉 You have rented 3 movies! Claim 5 Days of Ad-Free Viewing!
              </h3>
              <p class="text-slate-300 text-sm max-w-2xl">
                Activating this offer gives you <strong>5 days of 100% ad-free unlimited streaming</strong>.
                Upon activation, your pool counter resets to <strong>0</strong> for your next reward cycle.
              </p>
            ` : is5DayActive ? `
              <h3 class="brand-font text-2xl font-bold text-emerald-300 mb-1">
                ⚡ 5-Day Ad-Free Pass is Currently Active!
              </h3>
              <p class="text-slate-300 text-sm max-w-2xl">
                Enjoying zero commercial breaks across all content. Current pool progress towards next pass: <strong class="text-white">${poolCount}/3 movies</strong>.
              </p>
            ` : `
              <h3 class="brand-font text-2xl font-bold text-white mb-1">
                Rent 3 Movies ➔ Unlock 5 Days of Ad-Free Viewing!
              </h3>
              <p class="text-slate-300 text-sm max-w-2xl">
                You currently have <strong>${poolCount} of 3 movies rented</strong> in your offer pool.
                Rent ${3 - poolCount} more to unlock 5 days ad-free!
              </p>
            `}
          </div>

          <div class="flex items-center space-x-3 z-10 flex-shrink-0">
            ${poolCount >= 3 ? `
              <button onclick="activateAdFree5DaysOffer()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition shadow-lg glow-emerald">
                Claim 5 Days Ad-Free (Reset Pool to 0)
              </button>
            ` : `
              <button onclick="rentMovie('fighter-air')" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg glow-gold">
                + Rent Movie (+1 to Pool)
              </button>
            `}
          </div>
        </div>
      </div>
    ` : ''}

    <!-- ROW 2: Included with Subscription / Ads -->
    <div class="max-w-7xl mx-auto px-4 my-8" id="movies">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="brand-font text-2xl font-bold text-white">Trending Movies & Series</h2>
          <p class="text-xs text-slate-400">Included in Ad-Free & Ad-Supported tiers</p>
        </div>
        <span class="text-xs text-emerald-400 font-medium">Eligible for Share & Earn Rewards</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        ${includedTitles.map(movie => `
          <div class="glass-card rounded-2xl overflow-hidden movie-card flex flex-col justify-between">
            <div class="relative h-48 overflow-hidden">
              <img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover poster-zoom" />
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-emerald-400 rounded-lg border border-emerald-500/30">
                  Included Free
                </span>
              </div>
              <div class="absolute bottom-3 right-3">
                <span class="px-2 py-0.5 bg-black/80 backdrop-blur-md text-amber-400 text-xs font-semibold rounded">
                  ★ ${movie.rating}
                </span>
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-base text-white mb-1">${movie.title}</h3>
                <p class="text-xs text-slate-400 mb-2">${movie.genre} • ${movie.duration}</p>
                <p class="text-xs text-slate-300 line-clamp-2 mb-4">${movie.description}</p>
              </div>

              <div class="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <button onclick="openVideoPlayer('${movie.id}')" class="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-1">
                  <span>▶</span>
                  <span>Play</span>
                </button>
                <button onclick="openShareModal('${movie.id}')" title="Share & Earn" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition flex items-center space-x-1">
                  <span>🔗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ROW 3: TVOD Rentals Store -->
    <div class="max-w-7xl mx-auto px-4 my-10" id="tvod">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="brand-font text-2xl font-bold text-white flex items-center space-x-2">
            <span>New Releases & TVOD Rentals</span>
            <span class="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 font-semibold">Pay-Per-View</span>
          </h2>
          <p class="text-xs text-slate-400">Renting titles adds +1 to your 5-Day Ad-Free Reward Pool</p>
        </div>
        ${user.freeRentalCredits > 0 ? `
          <div class="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl font-bold flex items-center space-x-1.5 animate-pulse">
            <span>🎁</span>
            <span>${user.freeRentalCredits} Free Rental Voucher Active</span>
          </div>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
        ${rentalTitles.map(movie => `
          <div class="glass-card rounded-2xl overflow-hidden movie-card flex flex-col sm:flex-row">
            <div class="sm:w-48 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
              <img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover poster-zoom" />
              <div class="absolute top-3 left-3">
                <span class="px-2 py-1 bg-amber-600/90 text-white font-bold text-[11px] rounded-lg">
                  ₹${movie.rentalPrice} Rental
                </span>
              </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="font-bold text-lg text-white">${movie.title}</h3>
                  <span class="text-amber-400 text-xs font-bold">★ ${movie.rating}</span>
                </div>
                <p class="text-xs text-slate-400 mb-2">${movie.genre} • ${movie.duration}</p>
                <p class="text-xs text-slate-300 line-clamp-2 mb-4">${movie.description}</p>
              </div>

              <div class="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Standard Rental</div>
                  <div class="text-base font-extrabold text-white">₹${movie.rentalPrice} <span class="text-[10px] text-slate-400 font-normal">/ 48 hrs</span></div>
                </div>

                <div class="flex items-center space-x-2">
                  ${user.freeRentalCredits > 0 ? `
                    <button onclick="redeemFreeRental('${movie.id}')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md glow-emerald">
                      🎁 Use Free Voucher
                    </button>
                  ` : `
                    <button onclick="rentMovie('${movie.id}')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition">
                      Rent ₹${movie.rentalPrice} (+1 Pool)
                    </button>
                  `}
                  <button onclick="openShareModal('${movie.id}')" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition">
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ROW 4: Rental Ledger & Pool Tracker -->
    <div class="max-w-7xl mx-auto px-4 my-10" id="my-rentals">
      <div class="glass-panel p-6 rounded-3xl border border-slate-800">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 class="brand-font text-xl font-bold text-white flex items-center space-x-2">
              <span>My Rental Library & Offer Pool</span>
              <span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">${user.rentalsThisMonth.length} titles rented</span>
            </h3>
            <p class="text-xs text-slate-400">Offer Pool Counter: <strong class="text-emerald-400 font-mono">${poolCount}/3</strong> (Resets to 0 upon activating 5 days ad-free)</p>
          </div>

          <div class="text-right">
            <div class="text-xs text-slate-400">Total Spent on Rentals:</div>
            <div class="text-lg font-black text-rose-400">
              ₹${user.rentalsThisMonth.reduce((acc, cur) => acc + cur.price, 0)}
              <span class="text-xs text-slate-400 font-normal">vs ₹149 Ad-Free</span>
            </div>
          </div>
        </div>

        ${user.rentalsThisMonth.length === 0 ? `
          <div class="text-center py-8 text-slate-500 text-sm">No rentals made this calendar month.</div>
        ` : `
          <div class="divide-y divide-slate-800/80">
            ${user.rentalsThisMonth.map(item => `
              <div class="py-3 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold">
                    🎬
                  </div>
                  <div>
                    <div class="font-bold text-slate-200">${item.title}</div>
                    <div class="text-slate-400">Rented on ${item.date} • 48-Hour Window Active</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-white">₹${item.price}</div>
                  <div class="text-[10px] text-emerald-400">Contributed to Offer Pool</div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

/**
 * Feature A: Share Modal Renderer
 */
function renderShareModal() {
  const modalContainer = document.getElementById('share-modal-container');
  if (!modalContainer) return;

  const { isOpen, titleObj } = state.modals.shareModal;
  if (!isOpen || !titleObj) {
    modalContainer.innerHTML = '';
    return;
  }

  const user = state.users[state.currentPersona];
  const referralUrl = `https://streamflow.ott/watch?v=${titleObj.id}&ref=${user.id}`;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="glass-modal max-w-lg w-full rounded-3xl p-6 sm:p-8 relative border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onclick="state.modals.shareModal.isOpen = false; renderShareModal();" class="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
          &times;
        </button>

        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
            🔗
          </div>
          <div>
            <h3 class="brand-font text-xl font-bold text-white">Share & Earn Rewards</h3>
            <p class="text-xs text-slate-400">PRD Section 5 • 15% Ad Rev Share + ₹20 Flat Bonus</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5">
          <img src="${titleObj.poster}" alt="${titleObj.title}" class="w-14 h-14 rounded-xl object-cover" />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-sm text-white truncate">${titleObj.title}</h4>
            <p class="text-xs text-slate-400">${titleObj.genre} • Rating: ${titleObj.rating}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left">
            <div class="text-[10px] uppercase font-bold text-emerald-400 mb-1">Ad-Tier Rev Share</div>
            <div class="text-lg font-black text-white">15%</div>
            <div class="text-[11px] text-slate-300">Of friend's ad-tier viewing (~₹18 per 3 mos)</div>
          </div>
          <div class="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-left">
            <div class="text-[10px] uppercase font-bold text-purple-400 mb-1">Subscription Bonus</div>
            <div class="text-lg font-black text-white">₹20 Flat</div>
            <div class="text-[11px] text-slate-300">When friend starts paid subscription</div>
          </div>
        </div>

        <div class="mb-5">
          <label class="block text-xs font-semibold text-slate-300 mb-2">Your Tracked Referral Link:</label>
          <div class="flex items-center space-x-2">
            <input type="text" id="referral-url-input" readonly value="${referralUrl}" class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none" />
            <button onclick="copyReferralLink()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition">
              Copy
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-3 mb-6">
          <button onclick="simulateWhatsAppShare()" class="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md">
            <span>💬 Share via WhatsApp</span>
          </button>
          <button onclick="showToast('QR Code generated. Scan to open referral link.', 'info')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition">
            📱 QR Code
          </button>
        </div>

        <div class="text-[11px] text-slate-400 space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
          <div class="flex items-center space-x-1.5 text-slate-300 font-semibold">
            <span>🛡️</span>
            <span>Pilot Guardrails:</span>
          </div>
          <div>• Cap: Max ₹300 per referrer/month • 1 bonus per friend account.</div>
          <div>• Vesting: Rewards credit after friend stays active for 30 days.</div>
          <div>• Anti-fraud: 1 reward account per device/payment method + Phone OTP required.</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Feature B & C: Rental Upgrade Prompt & 5-Day Ad-Free Offer Modal
 */
function renderRentalPromptModal() {
  const modalContainer = document.getElementById('rental-prompt-container');
  if (!modalContainer) return;

  const { isOpen } = state.modals.rentalPromptModal;
  if (!isOpen) {
    modalContainer.innerHTML = '';
    return;
  }

  const user = state.users[state.currentPersona];
  const poolCount = user.rentalsForAdFreePool ?? 0;
  const isArm2 = state.abTestArm === 'arm2';

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div class="glass-modal max-w-lg w-full rounded-3xl p-6 sm:p-8 relative border border-emerald-500/40 shadow-2xl animate-in zoom-in-95 duration-200">
        <button onclick="dismissRentalPrompt()" class="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
          &times;
        </button>

        <div class="flex items-center space-x-2 mb-4">
          <span class="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
            Feature B: 5 Days Ad-Free Unlocked
          </span>
          <span class="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
            ${isArm2 ? 'A/B Test: Arm 2 (Bonus)' : 'A/B Test: Arm 1 (Standard)'}
          </span>
        </div>

        <h3 class="brand-font text-2xl font-black text-white leading-tight mb-2">
          You've rented ${poolCount >= 3 ? '3' : poolCount} movies! Watch Ad-Free for 5 Days.
        </h3>
        <p class="text-slate-300 text-sm mb-5">
          Because you rented 3 titles in your reward pool, you qualify for <strong>5 Days of Ad-Free Unlimited Streaming</strong> on all movies and series.
        </p>

        <!-- Pool counter reset indicator -->
        <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="text-slate-300 font-semibold">Offer Pool Status:</span>
            <span class="text-emerald-400 font-mono font-bold">${poolCount} / 3 Rented</span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
            <div class="h-full bg-emerald-500 rounded-full" style="width: ${Math.min(100, (poolCount/3)*100)}%"></div>
          </div>
          <div class="text-[11px] text-amber-300 flex items-center space-x-1.5">
            <span>⚡</span>
            <span><strong>Note:</strong> Upon activating this 5-day offer, your pool counter will reset to <strong>0</strong> for the next reward cycle.</span>
          </div>
        </div>

        ${isArm2 ? `
          <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/50 mb-6 flex items-start space-x-3 glow-emerald">
            <div class="text-2xl">🎁</div>
            <div>
              <div class="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                Special Pilot Bonus
              </div>
              <div class="text-sm font-extrabold text-white">
                Plus 1 Free New-Release Rental if you upgrade permanently!
              </div>
            </div>
          </div>
        ` : ''}

        <div class="space-y-3">
          <button onclick="activateAdFree5DaysOffer()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm transition shadow-xl glow-emerald flex items-center justify-center space-x-2">
            <span>Activate 5 Days Ad-Free (Reset Pool to 0)</span>
            <span>→</span>
          </button>

          <button onclick="clickUpgradeFromPrompt()" class="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700">
            Or Upgrade Permanently to Ad-Free (₹149/mo)
          </button>
          
          <button onclick="dismissRentalPrompt()" class="w-full py-2 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs font-medium transition">
            Not now (Dismiss for 30 days)
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Paywall Modal
 */
function renderPaywallModal() {
  const modalContainer = document.getElementById('paywall-modal-container');
  if (!modalContainer) return;

  const { isOpen, planSelected } = state.modals.paywallModal;
  if (!isOpen) {
    modalContainer.innerHTML = '';
    return;
  }

  const user = state.users[state.currentPersona];
  const isAnnual = planSelected === 'annual';
  const hasBonus = state.abTestArm === 'arm2';

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div class="glass-modal max-w-xl w-full rounded-3xl p-6 sm:p-8 relative border border-slate-700/80 shadow-2xl animate-in zoom-in-95 duration-200">
        <button onclick="state.modals.paywallModal.isOpen = false; renderPaywallModal();" class="absolute top-5 right-5 text-slate-400 hover:text-white text-xl">
          &times;
        </button>

        <div class="text-center mb-6">
          <div class="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white mb-2 shadow-lg glow-red">
            👑
          </div>
          <h3 class="brand-font text-2xl font-black text-white">Choose Your Ad-Free Experience</h3>
          <p class="text-xs text-slate-400">Stream unlimited blockbusters with zero commercial breaks</p>
          
          ${user.referredBy ? `
            <div class="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-500/40 rounded-full text-cyan-300 text-xs font-semibold">
              <span>🔗</span>
              <span>Referred by ${user.referredByName} (${user.referredBy})</span>
            </div>
          ` : ''}
        </div>

        <div class="flex items-center justify-center space-x-3 mb-6">
          <span class="text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}">Monthly Billing</span>
          <button onclick="state.modals.paywallModal.planSelected = '${isAnnual ? 'monthly' : 'annual'}'; renderPaywallModal();" class="w-14 h-7 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition ${isAnnual ? 'justify-end bg-rose-600 border-rose-500' : 'justify-start'}">
            <div class="w-5 h-5 rounded-full bg-white shadow-md"></div>
          </button>
          <span class="text-xs font-semibold ${isAnnual ? 'text-white' : 'text-slate-400'} flex items-center space-x-1">
            <span>Annual Plan</span>
            <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Save 16.7%</span>
          </span>
        </div>

        <div class="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6">
          <div class="flex items-baseline justify-between mb-3">
            <div>
              <div class="text-sm font-bold text-white capitalize">${planSelected} Ad-Free Pass</div>
              <div class="text-xs text-slate-400">
                ${isAnnual ? 'Pay for 10 months, get 12 (PRD Section 8)' : 'Flexible cancellation anytime'}
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-white">${isAnnual ? '₹1,490' : '₹149'}</div>
              <div class="text-[10px] text-slate-400">
                ${isAnnual ? '<span class="line-through text-slate-500">₹1,788</span> (Save ₹298/yr)' : '/month'}
              </div>
            </div>
          </div>

          <div class="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
            <div class="flex items-center space-x-2">
              <span class="text-emerald-400">✓</span>
              <span>100% Ad-Free on all movies, originals, and series</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-emerald-400">✓</span>
              <span>4K Ultra HD + Dolby Atmos on TV, Mobile & Web</span>
            </div>
            ${hasBonus ? `
              <div class="flex items-center space-x-2 text-amber-300 font-semibold">
                <span class="text-amber-400">🎁</span>
                <span>Includes 1 Free New-Release Rental Voucher (Valid 7 Days)</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="mb-6 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-300">Device & Account Verification:</span>
            <span class="text-[10px] text-emerald-400 font-mono">Device: ${user.deviceId}</span>
          </div>

          <div class="flex items-center space-x-2">
            <input type="text" value="${user.phone}" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 flex-1" readonly />
            <span class="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1">
              <span>✓</span>
              <span>OTP Verified</span>
            </span>
          </div>
        </div>

        <button onclick="completeSubscription()" class="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm transition shadow-xl glow-red flex items-center justify-center space-x-2">
          <span>Complete Payment via UPI / Card (${isAnnual ? '₹1,490' : '₹149'})</span>
          <span>→</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Wallet Drawer
 */
function toggleWalletDrawer() {
  state.modals.walletDrawer.isOpen = !state.modals.walletDrawer.isOpen;
  renderWalletDrawer();
}

function renderWalletDrawer() {
  const container = document.getElementById('wallet-drawer-container');
  if (!container) return;

  if (!state.modals.walletDrawer.isOpen) {
    container.innerHTML = '';
    return;
  }

  const user = state.users[state.currentPersona];
  const stats = user.referralStats;
  const capPercentage = Math.min(100, Math.round((stats.accruedThisMonth / stats.monthlyCap) * 100));

  container.innerHTML = `
    <div class="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md glass-modal border-l border-slate-700/80 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
                  💰
                </div>
                <div>
                  <h3 class="brand-font text-lg font-bold text-white">Share & Earn Wallet</h3>
                  <p class="text-xs text-slate-400">Referral ID: <code class="text-cyan-400 font-mono">${user.id}</code></p>
                </div>
              </div>
              <button onclick="toggleWalletDrawer()" class="text-slate-400 hover:text-white text-2xl">
                &times;
              </button>
            </div>

            <div class="grid grid-cols-2 gap-3 my-5">
              <div class="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Available to Payout</div>
                <div class="text-2xl font-black text-emerald-400 mt-1">₹${stats.vestedBalance}</div>
                <div class="text-[10px] text-slate-400 mt-1">Vested after 30 days</div>
              </div>
              <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Pending Vesting</div>
                <div class="text-2xl font-black text-amber-300 mt-1">₹${stats.pendingVestingBalance}</div>
                <div class="text-[10px] text-slate-400 mt-1">Active verification cycle</div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
              <div class="flex items-center justify-between text-xs mb-1.5 font-semibold">
                <span class="text-slate-300">Monthly Earnings Cap</span>
                <span class="text-emerald-400 font-mono">₹${stats.accruedThisMonth} / ₹${stats.monthlyCap}</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style="width: ${capPercentage}%"></div>
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                <span>Exposure protected</span>
                <span>${capPercentage}% reached</span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Referred Friends (${stats.friendsReferred.length})</h4>
                <span class="text-[10px] text-slate-400">30-day vesting rule</span>
              </div>

              <div class="space-y-2.5">
                ${stats.friendsReferred.map(f => `
                  <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-white">${f.name}</span>
                      <span class="font-extrabold text-emerald-400">+₹${f.amount}</span>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-slate-400">
                      <span>${f.status}</span>
                      <span>${f.rewardType === 'subscription_bonus' ? 'Flat Bonus' : '15% Ad Share'}</span>
                    </div>
                    <div class="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      ${f.vested ? `
                        <span class="text-emerald-400 font-semibold flex items-center space-x-1">
                          <span>✓</span>
                          <span>Vested & Approved</span>
                        </span>
                      ` : `
                        <span class="text-amber-400 flex items-center space-x-1">
                          <span>⏳</span>
                          <span>${f.vestingDaysLeft} days remaining</span>
                        </span>
                        <button onclick="simulateVestingReward('${f.name}')" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px]">
                          Simulate Vesting
                        </button>
                      `}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-800 space-y-3">
            <button onclick="showToast('Payout request of ₹${stats.vestedBalance} submitted for manual pilot approval.', 'info')" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md glow-emerald ${stats.vestedBalance === 0 ? 'opacity-50 pointer-events-none' : ''}">
              Request Payout (₹${stats.vestedBalance} Available)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Video Player Modal
 */
function renderVideoPlayerModal() {
  const container = document.getElementById('video-player-container');
  if (!container) return;

  const { isOpen, titleObj, isAdPlaying, adTimeLeft, adCanSkip } = state.activePlayer;
  if (!isOpen || !titleObj) {
    container.innerHTML = '';
    return;
  }

  const user = state.users[state.currentPersona];
  const is5DayActive = user.hasActive5DayPass && user.adFreePassExpires > Date.now();
  const isAdFree = user.tier === 'ad-free' || is5DayActive;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-lg">
      <div class="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
        <div class="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs z-20">
          <div class="flex items-center space-x-3">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="font-bold text-white text-sm truncate">${titleObj.title}</span>
            ${isAdFree ? `
              <span class="px-2 py-0.5 rounded-md ${is5DayActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-purple-950 text-purple-300 border border-purple-500/40'} text-[10px] font-bold">
                ${is5DayActive ? '⚡ 5-Day Ad-Free Pass Active' : '👑 Ad-Free VIP'}
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                Basic Ad-Tier
              </span>
            `}
          </div>
          <button onclick="closeVideoPlayer()" class="text-slate-400 hover:text-white text-xl px-2">
            &times;
          </button>
        </div>

        <div class="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img src="${titleObj.backdrop}" alt="${titleObj.title}" class="absolute inset-0 w-full h-full object-cover filter brightness-75 transition-all duration-700 ${isAdPlaying ? 'scale-105 blur-sm' : 'scale-100'}" />

          ${isAdPlaying ? `
            <div class="absolute inset-0 player-ad-overlay flex flex-col justify-between p-6 z-30 animate-in fade-in duration-300">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-md uppercase">
                    Ad 1 of 1
                  </span>
                  <span class="text-xs text-slate-300">Commercial break generates platform ad ARPU</span>
                </div>
                <div class="text-xs font-mono text-cyan-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                  Referral: ${user.referredBy || 'Organic'} • 15% rev share active
                </div>
              </div>

              <div class="text-center max-w-md mx-auto p-6 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-2xl">
                <div class="text-3xl mb-2">⚡</div>
                <h4 class="font-black text-xl text-white mb-1">NexPay Smart Cards</h4>
                <p class="text-xs text-slate-300 mb-4">Zero forex markup on international streaming subscriptions.</p>
                <div class="text-xs text-emerald-400 font-semibold">Generating ₹0.50 Ad Revenue per completed view</div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-xs text-slate-300">
                  Ad ends in <strong class="text-white font-mono text-sm">${adTimeLeft}s</strong>
                </div>
                <div>
                  ${adCanSkip ? `
                    <button onclick="completeAdBreak()" class="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-600 transition flex items-center space-x-1">
                      <span>Skip Ad</span>
                      <span>⏭</span>
                    </button>
                  ` : `
                    <div class="px-4 py-2 bg-slate-900/80 text-slate-400 rounded-xl text-xs font-medium border border-slate-800">
                      Skip in ${adTimeLeft - 5}s
                    </div>
                  `}
                </div>
              </div>
            </div>
          ` : `
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 z-20 opacity-90 hover:opacity-100 transition-opacity">
              <div class="w-full h-1.5 bg-slate-700 rounded-full mb-4 overflow-hidden cursor-pointer">
                <div class="w-1/3 h-full bg-rose-600 rounded-full"></div>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-200">
                <div class="flex items-center space-x-4">
                  <button class="text-white hover:text-rose-500 text-lg">⏸</button>
                  <span>24:18 / ${titleObj.duration}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-slate-400">Audio: Hindi (Dolby Atmos) • Subtitles: English</span>
                  <button class="hover:text-white">⛶</button>
                </div>
              </div>
            </div>
          `}
        </div>

        <div class="p-4 bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="text-slate-300">
            ${isAdFree ? '💎 Enjoying seamless 4K ad-free playback as an active member.' : '💡 Want zero ads? Rent 3 movies to get 5 Days Ad-Free, or subscribe for ₹149/mo!'}
          </div>
          ${!isAdFree ? `
            <button onclick="openPaywallModal('in_player_upgrade')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition">
              Upgrade to Ad-Free (₹149)
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function updateAdPlayerUI() {
  const container = document.getElementById('video-player-container');
  if (container && state.activePlayer.isOpen) {
    renderVideoPlayerModal();
  }
}

/**
 * Executive Pilot Dashboard Modal
 */
function openPilotDashboard() {
  state.modals.pilotDashboardModal.isOpen = true;
  renderPilotDashboardModal();
}

function renderPilotDashboardModal() {
  const container = document.getElementById('pilot-dashboard-container');
  if (!container) return;

  if (!state.modals.pilotDashboardModal.isOpen) {
    container.innerHTML = '';
    return;
  }

  const sim = state.simulator;
  const subRevenue = sim.sharesPerMonth * 0.1 * (sim.adFreePrice * sim.monthsReferredFriendStays);
  const adRevenue = sim.sharesPerMonth * 0.4 * (sim.adArpu * sim.monthsReferredFriendStays);
  const grossRev = subRevenue + adRevenue;
  const rewardsPaid = (sim.sharesPerMonth * 0.1 * 20) + (sim.sharesPerMonth * 0.4 * 18);
  const rewardCostRatio = grossRev > 0 ? ((rewardsPaid / grossRev) * 100).toFixed(1) : 0;

  const arm1Upgrades = sim.usersPerArm * sim.promptArm1Rate;
  const arm2Upgrades = sim.usersPerArm * sim.promptArm2Rate;
  const incrementalUpgrades = arm2Upgrades - arm1Upgrades;
  const ltvPerUpgrader = (sim.adFreePrice - sim.adArpu) / sim.churnRate;
  const incrementalLtv = incrementalUpgrades * ltvPerUpgrader;
  const arm2BonusCost = arm2Upgrades * sim.licensingCostPerBonus;
  const netLiftValue = incrementalLtv - arm2BonusCost;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div class="glass-modal max-w-5xl w-full rounded-3xl p-6 sm:p-8 relative border border-indigo-500/40 shadow-2xl my-auto">
        <button onclick="state.modals.pilotDashboardModal.isOpen = false; renderPilotDashboardModal();" class="absolute top-5 right-5 text-slate-400 hover:text-white text-2xl">
          &times;
        </button>

        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl">
            📊
          </div>
          <div>
            <h3 class="brand-font text-2xl font-bold text-white">Pilot Executive Dashboard & Economics Simulator</h3>
            <p class="text-xs text-slate-400">PRD 60-Day Pilot Evaluation • Real-time Financial Modeling</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Referred Subs / 100 Shares</div>
            <div class="text-2xl font-black text-cyan-400 mt-1">10.0</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">Target: Pay back reward ✓</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 ${rewardCostRatio > 15 ? 'border-rose-500' : 'border-emerald-500/30'}">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Reward Cost Ratio</div>
            <div class="text-2xl font-black text-emerald-400 mt-1">${rewardCostRatio}%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Target: Below 15%</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Prompt Upgrade Rate</div>
            <div class="text-2xl font-black text-amber-400 mt-1">4.0%</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">Target: At least 3% ✓</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">Bonus Incremental Lift</div>
            <div class="text-2xl font-black text-purple-400 mt-1">+1.00 pp</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">Target: ≥ 0.25 pp (Breakeven) ✓</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
            <div class="text-[10px] text-slate-400 uppercase font-semibold">30d Referred Retention</div>
            <div class="text-2xl font-black text-rose-400 mt-1">92.4%</div>
            <div class="text-[10px] text-emerald-400 mt-0.5">Above platform avg (91.8%) ✓</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-sm text-white flex items-center space-x-2">
                <span>Feature A: Share & Earn Economics (Scenario 3)</span>
              </h4>
              <span class="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">10 Shares Model</span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Projected Gross Revenue:</span>
                <span class="font-bold text-white">₹${grossRev.toFixed(0)}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Subscription Rev (1 Friend @ ₹149 x 3 mo):</span>
                <span class="font-mono text-cyan-300">₹${subRevenue.toFixed(0)}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Ad-Tier Rev (4 Friends @ ₹40 x 3 mo):</span>
                <span class="font-mono text-cyan-300">₹${adRevenue.toFixed(0)}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Total Rewards Paid (₹20 sub + 4 x ₹18 ad):</span>
                <span class="font-mono text-amber-300">₹${rewardsPaid.toFixed(0)}</span>
              </div>
              <div class="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                <span>Platform Net Margin Kept:</span>
                <span>₹${(grossRev - rewardsPaid).toFixed(0)} (${(100 - rewardCostRatio).toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-sm text-white flex items-center space-x-2">
                <span>Feature C: A/B Test Lifetime ROI (Scenario 7)</span>
              </h4>
              <span class="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold">2,000 Users / Arm</span>
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Arm 1 Upgrades (4% prompt only):</span>
                <span class="font-bold text-white">${arm1Upgrades} users</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Arm 2 Upgrades (5% prompt + bonus):</span>
                <span class="font-bold text-white">${arm2Upgrades} users (+${incrementalUpgrades})</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Bonus Licensing Cost (100 @ ₹60):</span>
                <span class="font-mono text-rose-400">₹${arm2BonusCost}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Incremental Lifetime Value:</span>
                <span class="font-mono text-emerald-400">₹${incrementalLtv.toFixed(0)}</span>
              </div>
              <div class="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                <span>Net Gain in Favor of Bonus:</span>
                <span>+₹${netLiftValue.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Telemetry Drawer
 */
function toggleTelemetryDrawer() {
  state.modals.telemetryDrawer.isOpen = !state.modals.telemetryDrawer.isOpen;
  renderTelemetryDrawer();
}

function updateTelemetryBadge() {
  const badge = document.getElementById('telemetry-badge');
  if (badge) {
    badge.innerText = state.eventLogs.length;
  }
}

function renderTelemetryDrawer() {
  const container = document.getElementById('telemetry-drawer-container');
  if (!container) return;

  if (!state.modals.telemetryDrawer.isOpen) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="fixed inset-y-0 right-0 w-full max-w-lg glass-modal border-l border-slate-700 z-50 p-6 flex flex-col justify-between shadow-2xl">
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 class="font-bold text-base text-white">Live Event Stream (Telemetry)</h3>
          </div>
          <button onclick="toggleTelemetryDrawer()" class="text-slate-400 hover:text-white text-xl">
            &times;
          </button>
        </div>

        <div class="text-xs text-slate-400 mb-3 flex items-center justify-between">
          <span>Tracking events specified in PRD Section 5 & 6</span>
          <button onclick="state.eventLogs = []; renderTelemetryLogs(); updateTelemetryBadge();" class="text-slate-400 hover:text-rose-400 text-[10px]">
            Clear Logs
          </button>
        </div>

        <div id="telemetry-logs-list" class="space-y-2 overflow-y-auto max-h-[75vh] pr-1"></div>
      </div>
    </div>
  `;

  renderTelemetryLogs();
}

function renderTelemetryLogs() {
  const list = document.getElementById('telemetry-logs-list');
  if (!list) return;

  if (state.eventLogs.length === 0) {
    list.innerHTML = `<div class="text-center py-10 text-xs text-slate-500">No events fired yet. Interact with the prototype to stream events!</div>`;
    return;
  }

  list.innerHTML = state.eventLogs.map(evt => `
    <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
      <div class="flex items-center justify-between mb-1">
        <span class="text-rose-400 font-bold">${evt.event}</span>
        <span class="text-slate-500 text-[10px]">${evt.timestamp}</span>
      </div>
      <div class="text-[10px] text-slate-400 mb-1">
        User: <span class="text-cyan-300">${evt.userId}</span> (${evt.persona}) • Arm: <span class="text-amber-300">${evt.arm}</span>
      </div>
      <div class="bg-slate-900 p-2 rounded text-[10px] text-slate-300 overflow-x-auto max-h-24">
        ${JSON.stringify(evt.data, null, 2)}
      </div>
    </div>
  `).join('');
}

/**
 * Main Application Render
 */
function renderApp() {
  renderTopSimulationBar();
  renderNavbar();
  renderHeroSection();
  renderContentRows();
  renderShareModal();
  renderRentalPromptModal();
  renderPaywallModal();
  renderWalletDrawer();
  renderVideoPlayerModal();
  renderPilotDashboardModal();
  renderTelemetryDrawer();
  updateTelemetryBadge();
}

// Initial bootstrap
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  
  trackEvent('prototype_session_init', {
    defaultPersona: state.currentPersona,
    pilotMarket: 'IN',
    pilotDuration: '60_days'
  });
});

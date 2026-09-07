/**
 * Game configuration data.
 * Maps operator names (from IAK) to display info and input requirements.
 * 
 * inputFormat:
 *   'user_id'          -> Only User ID required (e.g., Free Fire, PUBG)
 *   'user_id_zone'     -> User ID + Zone ID required (e.g., Mobile Legends)
 *   'user_id_server'   -> User ID + Server ID required (e.g., Genshin Impact)
 *   'none'             -> No ID required, voucher code will be given (e.g., Google Play, Steam, Roblox)
 */

// Popular games that should appear prominently on the grid
export const popularGames = [
  'Mobile Legend',
  'Free Fire',
  'PUBG Mobile',
  'Genshin Impact',
  'Honkai Star Rail',
  'Valorant',
  'Call of Duty Mobile',
  'Roblox',
  'Honor Of Kings',
  'Zenless Zone Zero',
  'Wuthering Waves',
  'Honkai Impact 3',
  'PUBG Mobile Global',
  'Mobile Legend Global',
];

export const gameConfig = {
  // ============= DIRECT TOP-UP (butuh ID pemain) =============
  'Mobile Legend': {
    color: '#1C2C5B',
    gradient: 'from-blue-800 to-blue-950',
    emoji: '⚔️',
    inputFormat: 'user_id_zone',
    inputLabels: { primary: 'User ID', secondary: 'Zone ID' },
    inputPlaceholders: { primary: 'Masukkan User ID', secondary: 'Masukkan Zone ID' },
    hint: 'Buka Profile di game → User ID dan Zone ID ada di bawah avatar.',
  },
  'Mobile Legend Global': {
    color: '#1C2C5B',
    gradient: 'from-blue-700 to-blue-900',
    emoji: '🌍',
    inputFormat: 'user_id_zone',
    inputLabels: { primary: 'User ID', secondary: 'Zone ID' },
    inputPlaceholders: { primary: 'Masukkan User ID', secondary: 'Masukkan Zone ID' },
    hint: 'User ID & Zone ID tersedia di Profile → Info Akun.',
  },
  'Mobile Legend Powered by Google Play': {
    color: '#1C2C5B',
    gradient: 'from-blue-700 to-indigo-900',
    emoji: '▶️',
    inputFormat: 'user_id_zone',
    inputLabels: { primary: 'User ID', secondary: 'Zone ID' },
    inputPlaceholders: { primary: 'Masukkan User ID', secondary: 'Masukkan Zone ID' },
    hint: 'User ID & Zone ID tersedia di Profile → Info Akun.',
  },
  'Free Fire': {
    color: '#FF5722',
    gradient: 'from-orange-500 to-red-700',
    emoji: '🔥',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID Free Fire' },
    hint: 'Buka Profile → User ID tertera di bawah nama karakter.',
  },
  'Free Fire Powered by Google Play': {
    color: '#FF5722',
    gradient: 'from-orange-400 to-red-600',
    emoji: '▶️',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID Free Fire' },
    hint: 'User ID tersedia di Profile.',
  },
  'PUBG Mobile': {
    color: '#F9A825',
    gradient: 'from-yellow-500 to-amber-700',
    emoji: '🎯',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID PUBG Mobile' },
    hint: 'Buka Profile → Player ID tertera di bawah nama karakter.',
  },
  'PUBG Mobile Global': {
    color: '#F9A825',
    gradient: 'from-yellow-400 to-orange-600',
    emoji: '🌐',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID PUBG Global' },
    hint: 'Player ID tersedia di Profile.',
  },
  'PUBG Mobile Powered by Google Play': {
    color: '#F9A825',
    gradient: 'from-yellow-400 to-amber-600',
    emoji: '▶️',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID PUBG Mobile' },
    hint: 'Player ID tersedia di Profile.',
  },
  'Genshin Impact': {
    color: '#3A86FF',
    gradient: 'from-cyan-400 to-blue-600',
    emoji: '🌟',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID Genshin', secondary: 'Contoh: os_asia' },
    hint: 'Buka Paimon Menu → UID tertera di bawah kiri layar. Server: os_asia / os_euro / os_usa / os_cht.',
    serverOptions: [
      { label: 'Asia', value: 'os_asia' },
      { label: 'Europe', value: 'os_euro' },
      { label: 'America', value: 'os_usa' },
      { label: 'TW/HK/MO', value: 'os_cht' },
    ],
  },
  'Genshin Impact Powered by Google Play': {
    color: '#3A86FF',
    gradient: 'from-cyan-300 to-blue-500',
    emoji: '▶️',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID Genshin', secondary: 'Contoh: os_asia' },
    hint: 'UID di sudut kiri bawah layar.',
    serverOptions: [
      { label: 'Asia', value: 'os_asia' },
      { label: 'Europe', value: 'os_euro' },
      { label: 'America', value: 'os_usa' },
      { label: 'TW/HK/MO', value: 'os_cht' },
    ],
  },
  'Honkai Star Rail': {
    color: '#6C5CE7',
    gradient: 'from-violet-500 to-purple-700',
    emoji: '🚂',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID HSR', secondary: 'Contoh: os_asia' },
    hint: 'UID tertera di Setting → Account.',
    serverOptions: [
      { label: 'Asia', value: 'os_asia' },
      { label: 'Europe', value: 'os_euro' },
      { label: 'America', value: 'os_usa' },
      { label: 'TW/HK/MO', value: 'os_cht' },
    ],
  },
  'Honkai Impact 3': {
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-indigo-700',
    emoji: '⚡',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID HI3', secondary: 'Contoh: os_asia' },
    hint: 'Buka Settings → Account → UID tertera di sana.',
    serverOptions: [
      { label: 'Asia (SEA)', value: 'os_asia' },
      { label: 'Europe', value: 'os_euro' },
      { label: 'America', value: 'os_usa' },
    ],
  },
  'Valorant': {
    color: '#FD4556',
    gradient: 'from-red-500 to-rose-700',
    emoji: '🎮',
    inputFormat: 'none',
    hint: 'Anda akan mendapatkan kode voucher yang bisa diredeem.',
  },
  'Valorant Malaysia': {
    color: '#FD4556',
    gradient: 'from-red-400 to-rose-600',
    emoji: '🇲🇾',
    inputFormat: 'none',
    hint: 'Kode voucher akan diberikan setelah pembayaran.',
  },
  'Valorant Philippines': {
    color: '#FD4556',
    gradient: 'from-red-400 to-rose-600',
    emoji: '🇵🇭',
    inputFormat: 'none',
  },
  'Valorant Singapore': {
    color: '#FD4556',
    gradient: 'from-red-400 to-rose-600',
    emoji: '🇸🇬',
    inputFormat: 'none',
  },
  'Valorant Thailand': {
    color: '#FD4556',
    gradient: 'from-red-400 to-rose-600',
    emoji: '🇹🇭',
    inputFormat: 'none',
  },
  'Call of Duty Mobile': {
    color: '#4CAF50',
    gradient: 'from-green-600 to-emerald-800',
    emoji: '🔫',
    inputFormat: 'user_id',
    inputLabels: { primary: 'Player ID' },
    inputPlaceholders: { primary: 'Masukkan Player ID CODM' },
    hint: 'Buka Profile → Player ID tertera di bawah username.',
  },
  'Call of Duty Mobile Powered by Google Play': {
    color: '#4CAF50',
    gradient: 'from-green-500 to-emerald-700',
    emoji: '▶️',
    inputFormat: 'user_id',
    inputLabels: { primary: 'Player ID' },
    inputPlaceholders: { primary: 'Masukkan Player ID CODM' },
  },
  'Honor Of Kings': {
    color: '#C49B30',
    gradient: 'from-amber-500 to-yellow-700',
    emoji: '👑',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID' },
    hint: 'Buka Profile di lobby utama untuk melihat User ID.',
  },
  'Zenless Zone Zero': {
    color: '#0EA5E9',
    gradient: 'from-sky-400 to-cyan-600',
    emoji: '🤖',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID ZZZ', secondary: 'Contoh: os_asia' },
    hint: 'UID tersedia di Settings → Account.',
    serverOptions: [
      { label: 'Asia', value: 'os_asia' },
      { label: 'Europe', value: 'os_euro' },
      { label: 'America', value: 'os_usa' },
      { label: 'TW/HK/MO', value: 'os_cht' },
    ],
  },
  'Wuthering Waves': {
    color: '#2563EB',
    gradient: 'from-blue-500 to-indigo-700',
    emoji: '🌊',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID', secondary: 'Contoh: SEA' },
    hint: 'UID tertera di Profile.',
    serverOptions: [
      { label: 'SEA', value: 'SEA' },
      { label: 'Asia', value: 'Asia' },
      { label: 'Europe', value: 'Europe' },
      { label: 'America', value: 'America' },
    ],
  },

  // ============= VOUCHER / REDEEM (tidak butuh ID) =============
  'Roblox': {
    color: '#E11D48',
    gradient: 'from-rose-500 to-red-700',
    emoji: '🧱',
    inputFormat: 'none',
    hint: 'Anda akan mendapatkan kode voucher Roblox yang bisa diredeem.',
  },
  'Steam Sea': {
    color: '#1B2838',
    gradient: 'from-slate-700 to-slate-900',
    emoji: '🎮',
    inputFormat: 'none',
    hint: 'Kode Steam Wallet akan diberikan setelah pembayaran.',
  },
  'Google Play Indonesia': {
    color: '#34A853',
    gradient: 'from-green-500 to-emerald-700',
    emoji: '▶️',
    inputFormat: 'none',
    hint: 'Kode voucher Google Play akan diberikan setelah pembayaran.',
  },
  'Google Play US REGION': {
    color: '#34A853',
    gradient: 'from-green-400 to-emerald-600',
    emoji: '🇺🇸',
    inputFormat: 'none',
  },
  'Nintendo eShop': {
    color: '#E60012',
    gradient: 'from-red-500 to-red-700',
    emoji: '🎮',
    inputFormat: 'none',
  },
  'Playstation': {
    color: '#003087',
    gradient: 'from-blue-700 to-blue-900',
    emoji: '🎮',
    inputFormat: 'none',
  },
  'Playstation USA': {
    color: '#003087',
    gradient: 'from-blue-600 to-blue-800',
    emoji: '🇺🇸',
    inputFormat: 'none',
  },
  'Xbox Live (US)': {
    color: '#107C10',
    gradient: 'from-green-600 to-green-800',
    emoji: '🎮',
    inputFormat: 'none',
  },
  'iTunes US REGION': {
    color: '#FB5BC5',
    gradient: 'from-pink-500 to-fuchsia-700',
    emoji: '🎵',
    inputFormat: 'none',
  },
  'Razer PIN': {
    color: '#44D62C',
    gradient: 'from-lime-500 to-green-700',
    emoji: '🐍',
    inputFormat: 'none',
  },
  'UniPin': {
    color: '#E91E63',
    gradient: 'from-pink-500 to-pink-700',
    emoji: '🎫',
    inputFormat: 'none',
  },
  'Garena': {
    color: '#FF6600',
    gradient: 'from-orange-500 to-red-600',
    emoji: '🎮',
    inputFormat: 'none',
  },
  'RIOT CASH': {
    color: '#D32936',
    gradient: 'from-red-500 to-red-700',
    emoji: '💰',
    inputFormat: 'none',
  },
  'Fortnite': {
    color: '#9D4DFF',
    gradient: 'from-purple-500 to-indigo-700',
    emoji: '🏗️',
    inputFormat: 'none',
    hint: 'Kode V-Bucks akan diberikan setelah pembayaran.',
  },

  // ============ DIRECT TOP-UP (butuh user ID) =============
  'Arena of Valor': {
    color: '#2196F3',
    gradient: 'from-blue-500 to-blue-700',
    emoji: '⚔️',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID AOV' },
  },
  'Tower of Fantasy': {
    color: '#6366F1',
    gradient: 'from-indigo-500 to-violet-700',
    emoji: '🗼',
    inputFormat: 'user_id_server',
    inputLabels: { primary: 'UID', secondary: 'Server' },
    inputPlaceholders: { primary: 'Masukkan UID', secondary: 'Masukkan Server ID' },
  },
  'Ragnarok M': {
    color: '#7C3AED',
    gradient: 'from-violet-600 to-purple-800',
    emoji: '⚔️',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID' },
    inputPlaceholders: { primary: 'Masukkan User ID' },
  },
};

/**
 * Get the game config for a given operator name.
 * Returns a default config if not found.
 */
export function getGameConfig(operatorName) {
  return gameConfig[operatorName] || {
    color: '#6B7280',
    gradient: 'from-gray-500 to-gray-700',
    emoji: '🎮',
    inputFormat: 'user_id',
    inputLabels: { primary: 'User ID / Player ID' },
    inputPlaceholders: { primary: 'Masukkan ID akun game Anda' },
    hint: null,
  };
}

/**
 * Check if the game is a "popular" game (should be shown first in grid).
 */
export function isPopularGame(operatorName) {
  return popularGames.includes(operatorName);
}

/**
 * Categorize a product based on its name and game operator.
 */
export function getProductPackageInfo(productName = '') {
  const lower = productName.toLowerCase();

  // Weekly Diamond Pass
  if (lower.includes('weekly diamond pass') || lower.includes('weekly pass') || lower.includes('wdp')) {
    return {
      key: 'weekly_pass',
      label: 'Weekly Pass',
      icon: '🎟️',
      badge: 'Populer 🔥',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      priority: 1,
    };
  }

  // Twilight Pass / Starlight
  if (lower.includes('twilight pass') || lower.includes('twilight') || lower.includes('starlight')) {
    return {
      key: 'twilight_pass',
      label: 'Twilight Pass',
      icon: '👑',
      badge: 'Spesial 👑',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      priority: 2,
    };
  }

  // Welkin Moon (Genshin)
  if (lower.includes('welkin')) {
    return {
      key: 'welkin_pass',
      label: 'Welkin Moon',
      icon: '🌙',
      badge: 'Populer 🔥',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      priority: 1,
    };
  }

  // Pass & Membership (Free Fire Level Up, Membership, PUBG Royale Pass, etc.)
  if (
    lower.includes('level up pass') ||
    lower.includes('membership') ||
    lower.includes('royale pass') ||
    lower.includes('royal pass') ||
    lower.includes('battle pass') ||
    lower.includes('express supply') ||
    lower.includes('auric pass') ||
    lower.includes('season pass')
  ) {
    return {
      key: 'pass_membership',
      label: 'Pass & Member',
      icon: '⭐',
      badge: 'Pass ⭐',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      priority: 3,
    };
  }

  // Bundles / Packages
  if (lower.includes('bundle') || lower.includes('paket') || lower.includes('elite bundle') || lower.includes('epic bundle')) {
    return {
      key: 'bundle',
      label: 'Bundle Paket',
      icon: '📦',
      badge: 'Hemat 📦',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      priority: 4,
    };
  }

  // Global server / Region specific
  if (lower.includes('global') || lower.includes('filipina') || lower.includes('brazil') || lower.includes('turki') || lower.includes('my/sg')) {
    return {
      key: 'global_server',
      label: 'Server Global',
      icon: '🌐',
      badge: 'Global 🌐',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      priority: 6,
    };
  }

  // Google Play Promo
  if (lower.includes('google play') || lower.includes('powered by')) {
    return {
      key: 'google_play',
      label: 'Google Play',
      icon: '🎮',
      badge: 'Promo 🎮',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      priority: 5,
    };
  }

  // Default / Regular (Diamonds, Crystals, UC, Gold, Coins, etc.)
  return {
    key: 'regular',
    label: 'Diamonds Reguler',
    icon: '💎',
    badge: null,
    badgeColor: '',
    priority: 0,
  };
}

/**
 * Extract distinct package categories present in a list of products for a game.
 */
export function getGamePackageCategories(products = []) {
  const categoriesMap = new Map();

  // Always add 'all'
  categoriesMap.set('all', {
    key: 'all',
    label: 'Semua Paket',
    icon: '🌟',
    count: products.length,
    priority: -1,
  });

  products.forEach((p) => {
    const info = getProductPackageInfo(p.name || p.nominal || '');
    if (!categoriesMap.has(info.key)) {
      categoriesMap.set(info.key, {
        key: info.key,
        label: info.label,
        icon: info.icon,
        count: 1,
        priority: info.priority,
      });
    } else {
      categoriesMap.get(info.key).count += 1;
    }
  });

  return Array.from(categoriesMap.values()).sort((a, b) => a.priority - b.priority);
}

/**
 * Get popular/highlighted products for quick selection
 */
export function getQuickPicks(products = [], limit = 4) {
  const popularKeywords = [
    'weekly diamond pass',
    'twilight pass',
    'welkin',
    'level up pass',
    '85 diamond',
    '86 diamond',
    '70 diamond',
    '60 genesis',
    '140 diamond'
  ];
  
  const picks = [];
  for (const kw of popularKeywords) {
    const found = products.find(p => p.name?.toLowerCase().includes(kw) && !picks.some(x => x.id === p.id));
    if (found) {
      picks.push(found);
      if (picks.length >= limit) break;
    }
  }

  return picks;
}


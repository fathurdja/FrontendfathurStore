'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Phone, Zap, Wallet, Wifi, Gamepad2, ArrowLeft, Loader2, Search, AlertCircle, CheckCircle, ChevronRight, Info, Mail, Sparkles, Filter, X } from 'lucide-react';
import { getProducts, detectOperator, inquiryPln } from '@/lib/api';
import { formatRupiah, operatorColors, getOperatorInitials } from '@/lib/utils';
import { getGameConfig, popularGames, isPopularGame, getProductPackageInfo, getGamePackageCategories, getQuickPicks } from '@/lib/gameConfig';
import useAppStore from '@/store/useAppStore';

const categoryConfig = {
  'pulsa': {
    title: 'Isi Pulsa',
    icon: Phone,
    inputLabel: 'Nomor Handphone',
    inputPlaceholder: '08xxxxxxxxxx',
    inputType: 'tel',
    needsOperatorDetect: true,
    inputKey: 'phone_number',
  },
  'paket-data': {
    title: 'Paket Data',
    icon: Wifi,
    inputLabel: 'Nomor Handphone',
    inputPlaceholder: '08xxxxxxxxxx',
    inputType: 'tel',
    needsOperatorDetect: true,
    inputKey: 'phone_number',
  },
  'token-pln': {
    title: 'Token PLN',
    icon: Zap,
    inputLabel: 'No. Meter / ID Pelanggan',
    inputPlaceholder: 'Masukkan nomor meter PLN',
    inputType: 'text',
    needsInquiry: true,
    inputKey: 'customer_id',
  },
  'e-wallet': {
    title: 'Top-up E-Wallet',
    icon: Wallet,
    inputLabel: 'Nomor Tujuan',
    inputPlaceholder: '08xxxxxxxxxx',
    inputType: 'tel',
    showOperatorTabs: true,
    inputKey: 'phone_number',
  },
  'game-voucher': {
    title: 'Voucher Game',
    icon: Gamepad2,
    inputLabel: 'User ID / Player ID',
    inputPlaceholder: 'Masukkan User ID Game',
    inputType: 'text',
    showGameGrid: true,
    inputKey: 'customer_id',
  },
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const config = categoryConfig[slug];

  const { setCheckoutData } = useAppStore();

  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState(''); // For Zone ID / Server ID
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);
  const [operator, setOperator] = useState(null);
  const [selectedOperatorTab, setSelectedOperatorTab] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null); // For game grid selection
  const [selectedPackageCategory, setSelectedPackageCategory] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load all products for this category on mount
  useEffect(() => {
    if (!config) return;
    loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { category: slug };
      const res = await getProducts(params);
      const data = res.data.data || [];
      setProducts(data);

      if (config.showOperatorTabs || config.showGameGrid) {
        const ops = Array.from(new Set(data.map(p => p.operator).filter(Boolean))).sort();
        setAvailableOperators(ops);
        if (config.showOperatorTabs && ops.length > 0 && !selectedOperatorTab) {
          setSelectedOperatorTab(ops[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-detect operator when phone input changes (for pulsa/data)
  const handleInputChange = useCallback(async (value) => {
    setInputValue(value);
    setCustomerInfo(null);
    setError(null);

    if (config?.needsOperatorDetect && value.length >= 4) {
      setIsDetecting(true);
      try {
        const res = await detectOperator(value);
        const data = res.data.data;
        setOperator(data.operator);
        setProducts(data.products || []);
      } catch {
        // Silently fail - operator not detected yet
        if (value.length >= 10) {
          setError('Operator tidak dikenali');
        }
      } finally {
        setIsDetecting(false);
      }
    }
  }, [config]);

  // PLN inquiry
  const handlePlnInquiry = async () => {
    if (inputValue.length < 10) {
      setError('Masukkan minimal 10 digit nomor meter');
      return;
    }

    setIsDetecting(true);
    setError(null);
    setCustomerInfo(null);

    try {
      const res = await inquiryPln(inputValue);
      setCustomerInfo(res.data.data);
      // Load PLN products
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'ID Pelanggan tidak ditemukan');
    } finally {
      setIsDetecting(false);
    }
  };

  // Handle operator tab change (for e-wallet)
  const handleOperatorTabChange = (op) => {
    setSelectedOperatorTab(op);
  };

  // Handle game selection from grid
  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    setSelectedPackageCategory('all');
    setProductSearchQuery('');
    setPriceFilter('all');
    setSelectedProduct(null);
    setInputValue('');
    setInputValue2('');
    setError(null);
  };

  // Card click handler: validates ID input and smoothly proceeds or prompts
  const handleProductCardClick = (product) => {
    setSelectedProduct(product);
    setError(null);

    const gameConf = selectedGame ? getGameConfig(selectedGame) : null;
    if (gameConf && gameConf.inputFormat !== 'none') {
      const isInputValidNow = () => {
        if (gameConf.inputFormat === 'user_id') return inputValue.trim().length >= 3;
        if (gameConf.inputFormat === 'user_id_zone' || gameConf.inputFormat === 'user_id_server') {
          return inputValue.trim().length >= 3 && inputValue2.trim().length >= 1;
        }
        return false;
      };

      if (!isInputValidNow()) {
        setError(`Silakan isi ${gameConf.inputLabels?.primary || 'User ID'} terlebih dahulu untuk melanjutkan.`);
        const inputEl = document.getElementById('primary-game-input');
        if (inputEl) {
          inputEl.focus();
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    handleSelectProduct(product);
  };

  // Select a product and go to checkout
  const handleSelectProduct = (product) => {
    const gameConf = selectedGame ? getGameConfig(selectedGame) : null;
    let customerIdValue = inputValue;

    // For games that need zone/server id, combine them with pipe separator
    if (gameConf && (gameConf.inputFormat === 'user_id_zone' || gameConf.inputFormat === 'user_id_server')) {
      customerIdValue = `${inputValue}|${inputValue2}`;
    }

    const checkoutPayload = {
      product,
      [config.inputKey]: config.showGameGrid ? customerIdValue : inputValue,
      customer_email: email.trim() || undefined,
    };

    if (customerInfo) {
      checkoutPayload.customer_name = customerInfo.customer_name;
      checkoutPayload.customer_id = inputValue;
    }

    setCheckoutData(checkoutPayload);
    router.push('/checkout');
  };

  if (!config) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-muted">Kategori tidak ditemukan</p>
      </div>
    );
  }

  // ============ GAME VOUCHER: Custom Game Grid Layout ============
  if (config.showGameGrid) {
    const gameConf = selectedGame ? getGameConfig(selectedGame) : null;
    const allGameProducts = selectedGame 
      ? products.filter(p => p.operator === selectedGame) 
      : [];

    const packageCategories = getGamePackageCategories(allGameProducts);
    const quickPicks = getQuickPicks(allGameProducts, 4);

    const filteredGameProducts = allGameProducts.filter(p => {
      // 1. Package category filter
      if (selectedPackageCategory !== 'all') {
        const info = getProductPackageInfo(p.name || p.nominal || '');
        if (info.key !== selectedPackageCategory) return false;
      }

      // 2. Search query within game products
      if (productSearchQuery.trim()) {
        const query = productSearchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesNominal = (p.nominal || '').toLowerCase().includes(query);
        if (!matchesName && !matchesNominal) return false;
      }

      // 3. Price filter
      const price = parseFloat(p.price || 0);
      if (priceFilter === 'low' && price >= 50000) return false;
      if (priceFilter === 'mid' && (price < 50000 || price > 200000)) return false;
      if (priceFilter === 'high' && price <= 200000) return false;

      return true;
    });

    // Sort operators: popular games first, then alphabetically
    const sortedOperators = [...availableOperators].sort((a, b) => {
      const aPopular = isPopularGame(a);
      const bPopular = isPopularGame(b);
      if (aPopular && !bPopular) return -1;
      if (!aPopular && bPopular) return 1;
      return a.localeCompare(b);
    });

    // Filter by search
    const filteredOperators = searchQuery
      ? sortedOperators.filter(op => op.toLowerCase().includes(searchQuery.toLowerCase()))
      : sortedOperators;

    // Determine if input is valid for checkout
    const isInputValid = () => {
      if (!gameConf) return false;
      if (gameConf.inputFormat === 'none') return true;
      if (gameConf.inputFormat === 'user_id') return inputValue.length >= 3;
      if (gameConf.inputFormat === 'user_id_zone' || gameConf.inputFormat === 'user_id_server') {
        return inputValue.length >= 3 && inputValue2.length >= 1;
      }
      return false;
    };

    return (
      <div className="animate-fade-in w-full max-w-7xl mx-auto md:py-8 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-accent to-accent-alt px-5 md:px-8 pt-4 md:pt-6 pb-8 md:pb-10 -mt-0.5 md:mt-0 md:rounded-3xl shadow-xl">
          <button
            onClick={() => selectedGame ? setSelectedGame(null) : router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{selectedGame ? 'Pilih Game Lain' : 'Kembali'}</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-inner">
              <Gamepad2 size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-xl md:text-2xl">
                {selectedGame || 'Voucher Game'}
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                {selectedGame ? `${allGameProducts.length} produk tersedia` : `${availableOperators.length} game tersedia`}
              </p>
            </div>
          </div>

          {/* Search bar (only when no game selected) */}
          {!selectedGame && (
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game..."
                className="w-full bg-white/15 backdrop-blur-md text-white placeholder-white/40 rounded-xl pl-12 pr-4 py-3 border border-white/20 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-sm font-medium"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="px-5 md:px-0 -mt-4 md:-mt-6 relative z-10">

          {/* ========= GAME GRID (No game selected) ========= */}
          {!selectedGame && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-5 md:p-8 border border-border/50 animate-slide-up">
              {isLoading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="skeleton h-28 md:h-32 rounded-xl" />
                  ))}
                </div>
              ) : filteredOperators.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={40} className="mx-auto text-text-muted mb-4" />
                  <p className="text-text-dark font-semibold">Game tidak ditemukan</p>
                  <p className="text-text-muted text-sm mt-1">Coba kata kunci lain</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {filteredOperators.map((op, idx) => {
                    const gc = getGameConfig(op);
                    const productCount = products.filter(p => p.operator === op).length;
                    return (
                      <button
                        key={op}
                        onClick={() => handleGameSelect(op)}
                        className="relative bg-bg-main border-2 border-transparent rounded-xl md:rounded-2xl overflow-hidden text-left hover:border-primary hover:shadow-lg transition-all duration-300 group animate-scale-in"
                        style={{ animationDelay: `${Math.min(idx, 20) * 25}ms` }}
                      >
                        {/* Color bar top */}
                        <div className={`h-16 md:h-20 bg-gradient-to-br ${gc.gradient} flex items-center justify-center relative`}>
                          <span className="text-3xl md:text-4xl drop-shadow-lg group-hover:scale-125 transition-transform duration-300">
                            {gc.emoji}
                          </span>
                          {isPopularGame(op) && (
                            <span className="absolute top-1.5 right-1.5 text-[8px] bg-primary text-accent font-bold px-1.5 py-0.5 rounded-full shadow">
                              🔥
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 md:p-3">
                          <p className="font-bold text-text-darker text-[10px] md:text-xs leading-tight line-clamp-2 min-h-[24px] md:min-h-[32px]">
                            {op}
                          </p>
                          <p className="text-[9px] md:text-[10px] text-text-muted mt-1 font-medium">
                            {productCount} produk
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========= GAME SELECTED: Show Input + Products ========= */}
          {selectedGame && (
            <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
              
              {/* Input Panel */}
              <div className="md:col-span-5 lg:col-span-4 mb-4 md:mb-0">
                <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 border border-border/50 animate-slide-up">
                  
                  {/* Game Badge */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gameConf.gradient} flex items-center justify-center shadow-md`}>
                      <span className="text-2xl">{gameConf.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-darker text-sm truncate">{selectedGame}</h3>
                      <p className="text-text-muted text-xs mt-0.5">
                        {gameConf.inputFormat === 'none' ? 'Voucher / Redeem Code' : 'Direct Top Up'}
                      </p>
                    </div>
                  </div>

                  {/* Input Fields (only if not 'none') */}
                  {gameConf.inputFormat !== 'none' ? (
                    <div className="space-y-4">
                      {/* Primary Input (User ID / UID) */}
                      <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                          {gameConf.inputLabels?.primary || 'User ID'}
                        </label>
                        <input
                          id="primary-game-input"
                          type="text"
                          value={inputValue}
                          onChange={(e) => { setInputValue(e.target.value); setError(null); }}
                          placeholder={gameConf.inputPlaceholders?.primary || 'Masukkan ID'}
                          className="w-full bg-bg-main rounded-xl px-4 py-3.5 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold"
                        />
                      </div>

                      {/* Secondary Input (Zone ID / Server) */}
                      {(gameConf.inputFormat === 'user_id_zone' || gameConf.inputFormat === 'user_id_server') && (
                        <div>
                          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                            {gameConf.inputLabels?.secondary || 'Server / Zone ID'}
                          </label>
                          {gameConf.serverOptions ? (
                            <select
                              value={inputValue2}
                              onChange={(e) => setInputValue2(e.target.value)}
                              className="w-full bg-bg-main rounded-xl px-4 py-3.5 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold appearance-none"
                            >
                              <option value="">Pilih Server</option>
                              {gameConf.serverOptions.map((srv) => (
                                <option key={srv.value} value={srv.value}>{srv.label}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={inputValue2}
                              onChange={(e) => setInputValue2(e.target.value)}
                              placeholder={gameConf.inputPlaceholders?.secondary || 'Masukkan Zone/Server ID'}
                              className="w-full bg-bg-main rounded-xl px-4 py-3.5 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold"
                            />
                          )}
                        </div>
                      )}

                      {/* Hint */}
                      {gameConf.hint && (
                        <div className="flex items-start gap-2.5 bg-blue-50 p-3.5 rounded-xl border border-blue-100">
                          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] md:text-xs text-blue-700 leading-relaxed">{gameConf.hint}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-accent" />
                        <span className="text-sm font-bold text-accent">Voucher / Kode Redeem</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Produk ini berupa kode voucher. Setelah pembelian berhasil, kode voucher akan ditampilkan dan bisa Anda redeem di game.
                      </p>
                      {gameConf.hint && (
                        <p className="text-xs text-text-muted mt-2">{gameConf.hint}</p>
                      )}
                    </div>
                  )}

                  {/* Email Input for Invoice */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Email Penerima Invoice (Opsional)
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@contoh.com"
                        className="w-full bg-bg-main rounded-xl pl-10 pr-4 py-3 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-text-muted mt-1.5 flex items-center gap-1">
                      <span>✉️</span> Bukti transaksi & invoice akan otomatis dikirim ke email ini.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 bg-danger/10 rounded-xl p-3.5 border border-danger/20 flex items-center gap-3 animate-scale-in">
                      <AlertCircle size={18} className="text-danger flex-shrink-0" />
                      <p className="text-sm font-medium text-danger">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product List Panel */}
              <div className="md:col-span-7 lg:col-span-8">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-5 md:p-7 border border-border/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
                  
                  {/* Title & Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-text-darker uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-5 bg-primary rounded-full"></div>
                        Pilih Nominal & Paket
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        Menampilkan {filteredGameProducts.length} dari {allGameProducts.length} produk
                      </p>
                    </div>

                    {/* Quick In-Game Search */}
                    <div className="relative min-w-[200px] sm:max-w-xs">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        placeholder="Cari nominal (cth: 86, weekly)..."
                        className="w-full bg-bg-main rounded-xl pl-9 pr-8 py-2 text-xs font-medium border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      {productSearchQuery && (
                        <button
                          onClick={() => setProductSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. Quick Picks / Bestseller (When 'all' is selected and no active search) */}
                  {selectedPackageCategory === 'all' && !productSearchQuery && quickPicks.length > 0 && (
                    <div className="mb-5 bg-gradient-to-br from-amber-500/10 via-primary/5 to-accent/5 p-4 rounded-2xl border border-amber-500/20 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={16} className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                            ⚡ Pilihan Populer & Cepat
                          </span>
                        </div>
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                          Paling Sering Dibeli
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {quickPicks.map((pick) => {
                          const info = getProductPackageInfo(pick.name);
                          const isSelected = selectedProduct?.id === pick.id;
                          return (
                            <button
                              key={`quick-${pick.id}`}
                              onClick={() => handleProductCardClick(pick)}
                              className={`relative p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                                isSelected
                                  ? 'bg-primary-light border-primary shadow-md scale-[1.02]'
                                  : 'bg-white border-amber-200/80 hover:border-amber-400 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs">{info.icon}</span>
                                <span className="text-[10px] font-bold text-amber-800 truncate">{info.label}</span>
                              </div>
                              <p className="font-bold text-text-darker text-xs leading-tight line-clamp-1">
                                {pick.nominal || pick.name}
                              </p>
                              <p className="text-primary font-extrabold text-xs mt-1.5">
                                {formatRupiah(pick.price)}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Package Category Tabs (Sub-Kategori Paket: Weekly Pass, Twilight Pass, etc.) */}
                  {packageCategories.length > 2 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                        {packageCategories.map((cat) => {
                          const isActive = selectedPackageCategory === cat.key;
                          return (
                            <button
                              key={cat.key}
                              onClick={() => {
                                setSelectedPackageCategory(cat.key);
                                setProductSearchQuery('');
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                                isActive
                                  ? 'bg-accent text-white shadow-md transform scale-[1.02]'
                                  : 'bg-bg-main text-text-muted hover:bg-slate-200/70 hover:text-text-dark border border-border/40'
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                                  isActive ? 'bg-primary text-accent' : 'bg-border text-text-muted'
                                }`}
                              >
                                {cat.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Price Filter Chips (For regular or large sets) */}
                  {filteredGameProducts.length > 12 && (
                    <div className="flex items-center gap-1.5 mb-4 text-xs overflow-x-auto pb-1">
                      <span className="text-text-muted text-[11px] font-semibold flex items-center gap-1 mr-1 flex-shrink-0">
                        <Filter size={12} /> Filter Harga:
                      </span>
                      {[
                        { key: 'all', label: 'Semua' },
                        { key: 'low', label: '< Rp 50rb' },
                        { key: 'mid', label: 'Rp 50rb - 200rb' },
                        { key: 'high', label: '> Rp 200rb' },
                      ].map((pf) => (
                        <button
                          key={pf.key}
                          onClick={() => setPriceFilter(pf.key)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
                            priceFilter === pf.key
                              ? 'bg-primary text-accent font-bold shadow-sm'
                              : 'bg-bg-main text-text-muted hover:text-text-dark'
                          }`}
                        >
                          {pf.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 4. Products Grid */}
                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="skeleton h-24 rounded-xl" />
                      ))}
                    </div>
                  ) : filteredGameProducts.length === 0 ? (
                    <div className="text-center py-12 bg-bg-main rounded-2xl border border-dashed border-border">
                      <Search size={32} className="mx-auto text-text-muted mb-2" />
                      <p className="text-text-dark font-semibold text-sm">Tidak ada paket yang sesuai</p>
                      <p className="text-text-muted text-xs mt-1">Coba pilih kategori paket lain atau bersihkan pencarian</p>
                      <button
                        onClick={() => {
                          setSelectedPackageCategory('all');
                          setProductSearchQuery('');
                          setPriceFilter('all');
                        }}
                        className="mt-3 text-xs bg-primary text-accent font-bold px-4 py-1.5 rounded-lg hover:bg-primary-hover transition-all"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filteredGameProducts.map((product, idx) => {
                        const info = getProductPackageInfo(product.name || product.nominal || '');
                        const isSelected = selectedProduct?.id === product.id;

                        return (
                          <button
                            key={product.id}
                            onClick={() => handleProductCardClick(product)}
                            className={`relative bg-bg-main border-2 rounded-xl md:rounded-2xl p-3.5 text-left transition-all duration-200 group animate-scale-in flex flex-col justify-between ${
                              isSelected
                                ? 'border-primary bg-primary-light/40 shadow-md ring-2 ring-primary/30'
                                : 'border-border/60 hover:border-primary/80 hover:bg-primary-light/20 hover:shadow-sm'
                            }`}
                            style={{ animationDelay: `${Math.min(idx, 15) * 20}ms` }}
                          >
                            {/* Package badge if special (Weekly Pass, Twilight, Bundle, etc.) */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                                <span>{info.icon}</span>
                                <span className="truncate">{info.label}</span>
                              </span>
                              {info.badge && (
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${info.badgeColor}`}>
                                  {info.badge}
                                </span>
                              )}
                            </div>

                            {/* Product Name */}
                            <p className="font-bold text-text-darker text-xs md:text-sm mb-2 line-clamp-2 leading-snug min-h-[34px] flex items-center">
                              {product.nominal || product.name}
                            </p>

                            {/* Price & Action */}
                            <div className="pt-2 border-t border-border/40 flex items-end justify-between">
                              <div>
                                <p className="text-primary font-extrabold text-sm md:text-base leading-none">
                                  {formatRupiah(product.price)}
                                </p>
                                {product.admin_fee > 0 && (
                                  <p className="text-[9px] text-text-muted mt-0.5">
                                    +Admin {formatRupiah(product.admin_fee)}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-primary border-primary text-accent'
                                    : 'border-border group-hover:border-primary group-hover:bg-primary/20'
                                }`}
                              >
                                {isSelected ? (
                                  <CheckCircle size={14} className="text-accent" />
                                ) : (
                                  <ChevronRight size={12} className="text-text-muted group-hover:text-primary" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Spacer for bottom nav on mobile */}
        <div className="h-6 md:h-0" />
      </div>
    );
  }

  // ============ STANDARD CATEGORIES (Pulsa, Data, PLN, E-Wallet) ============

  // Filter products by selected tab if tabs are enabled
  const displayProducts = config.showOperatorTabs
    ? products.filter(p => p.operator === selectedOperatorTab)
    : products;

  const showProducts = config.showOperatorTabs
    ? true
    : slug === 'token-pln'
      ? customerInfo !== null
      : inputValue.length >= 4 && operator;

  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto md:py-8 lg:px-8 md:grid md:grid-cols-12 md:gap-8 items-start">
      
      {/* Left Column (Input Form) */}
      <div className="md:col-span-5 lg:col-span-4">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-accent to-accent-alt px-5 md:px-6 pt-4 md:pt-6 pb-8 md:pb-10 -mt-0.5 md:mt-0 md:rounded-3xl shadow-xl">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-inner">
              <config.icon size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-white font-extrabold text-xl">{config.title}</h2>
              <p className="text-white/70 text-xs mt-0.5">Pilih nominal dan bayar instan</p>
            </div>
          </div>

          {/* Input Field */}
          <div className="relative">
            <label className="block text-white/80 text-xs font-bold mb-2 uppercase tracking-wider">{config.inputLabel}</label>
            <input
              type={config.inputType}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={config.inputPlaceholder}
              className="w-full bg-white/15 backdrop-blur-md text-white placeholder-white/40 rounded-xl px-4 py-3.5 pr-12 border border-white/20 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-base font-semibold shadow-inner"
              maxLength={15}
            />
            <div className="absolute right-3 bottom-3.5">
              {isDetecting ? (
                <Loader2 size={20} className="text-primary animate-spin" />
              ) : operator && (config.needsOperatorDetect) ? (
                <span
                  className="text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: operatorColors[operator]?.bg || '#666',
                    color: operatorColors[operator]?.text || '#fff',
                  }}
                >
                  {operator}
                </span>
              ) : null}
            </div>
          </div>

          {/* Email Input (Optional) */}
          <div className="relative mt-4">
            <label className="block text-white/80 text-xs font-bold mb-2 uppercase tracking-wider">
              Email Penerima Invoice (Opsional)
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full bg-white/15 backdrop-blur-md text-white placeholder-white/40 rounded-xl pl-11 pr-4 py-3 border border-white/20 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-sm font-medium shadow-inner"
              />
            </div>
            <p className="text-[11px] text-white/70 mt-1">
              Bukti bayar & invoice otomatis dikirimkan ke email ini.
            </p>
          </div>

          {/* PLN Inquiry Button */}
          {config.needsInquiry && inputValue.length >= 10 && !customerInfo && (
            <button
              onClick={handlePlnInquiry}
              disabled={isDetecting}
              className="mt-4 w-full bg-primary text-accent font-extrabold py-3.5 rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDetecting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Mengecek...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Cek ID Pelanggan
                </>
              )}
            </button>
          )}

          {/* Customer Info (PLN) */}
          {customerInfo && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-primary/30 animate-scale-in">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-primary" />
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Pelanggan Ditemukan</span>
              </div>
              <p className="text-white font-extrabold text-base">{customerInfo.customer_name}</p>
              <p className="text-white/70 text-xs mt-1">
                No. Meter: {customerInfo.meter_no || inputValue} | Daya: {customerInfo.segment_power || '-'}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-danger/20 backdrop-blur-sm rounded-xl p-3.5 border border-danger/30 flex items-center gap-3 animate-scale-in">
              <AlertCircle size={18} className="text-danger flex-shrink-0" />
              <p className="text-white font-medium text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (Products) */}
      <div className="md:col-span-7 lg:col-span-8 flex flex-col mt-4 md:mt-0 px-5 md:px-0 mb-8 md:mb-0">
        
        {/* Operator Tabs (for e-wallet) */}
        {config.showOperatorTabs && availableOperators.length > 0 && (
          <div className="-mt-7 md:mt-0 mb-4 md:mb-6 z-10 relative">
            <div className="bg-white rounded-2xl shadow-lg p-2 md:p-3 flex gap-1.5 overflow-x-auto border border-border/50">
              {availableOperators.map((op) => (
                <button
                  key={op}
                  onClick={() => handleOperatorTabChange(op)}
                  className={`flex-1 px-4 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                    selectedOperatorTab === op
                      ? 'text-white shadow-md transform md:scale-105'
                      : 'text-text-muted hover:bg-bg-main hover:text-text-dark'
                  }`}
                  style={selectedOperatorTab === op ? {
                    backgroundColor: operatorColors[op]?.bg || '#666',
                  } : {}}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Nominal List */}
        <section className={`flex-1 ${slug === 'e-wallet' ? '' : '-mt-8 md:mt-0 relative z-10'}`}>
          {showProducts ? (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-5 md:p-8 border border-border/50 h-full animate-slide-up">
              <h3 className="text-sm md:text-base font-bold text-text-darker mb-5 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-6 bg-primary rounded-full"></div>
                Pilih Nominal
              </h3>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="skeleton h-24 rounded-xl" />
                  ))}
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-text-muted" />
                  </div>
                  <p className="text-text-dark font-semibold text-base">Produk tidak tersedia</p>
                  <p className="text-text-muted text-sm mt-1">Coba masukkan nomor dari operator lain</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {displayProducts.map((product, idx) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      disabled={!inputValue || (config.needsInquiry && !customerInfo)}
                      className="relative bg-bg-main border-2 border-transparent rounded-xl md:rounded-2xl p-4 text-left hover:border-primary hover:bg-primary-light hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group animate-scale-in"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <p className="font-bold text-text-darker text-sm mb-1.5 line-clamp-2 leading-tight min-h-[38px] flex items-center">
                        {product.nominal || product.name}
                      </p>
                      <p className="text-primary font-extrabold text-base md:text-lg">
                        {formatRupiah(product.price)}
                      </p>
                      {product.admin_fee > 0 && (
                        <p className="text-[10px] md:text-xs font-semibold text-text-muted mt-1.5">
                          + Admin {formatRupiah(product.admin_fee)}
                        </p>
                      )}
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary transition-all flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-white transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : slug !== 'e-wallet' && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-8 md:p-16 text-center animate-fade-in border border-border/50 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-light mx-auto mb-5 flex items-center justify-center">
                <config.icon size={36} className="text-accent" />
              </div>
              <p className="text-text-dark font-extrabold text-lg mb-2">
                {config.needsInquiry
                  ? 'Masukkan No. Meter PLN'
                  : 'Masukkan Nomor HP'}
              </p>
              <p className="text-text-muted text-sm max-w-xs mx-auto">
                {config.needsInquiry
                  ? 'Minimal 10 digit, lalu tekan "Cek ID Pelanggan" untuk memunculkan daftar nominal.'
                  : 'Operator akan terdeteksi otomatis dari prefix nomor yang Anda masukkan.'}
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

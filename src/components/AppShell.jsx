import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../store.jsx';
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Sun,
  Moon,
  Languages,
  LogOut,
  MessageSquare,
  X,
  Send,
  User,
  ArrowLeftRight,
  CloudSun,
  PackageCheck,
  Building,
  UserCheck,
  Stethoscope,
  ChevronRight,
  Settings
} from 'lucide-react';
import { districtsData, agroClimaticZones } from '../data/districtsData.js';

export default function AppShell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    userName,
    selectedDistrict,
    selectedCrop,
    language,
    theme,
    apiKey,
    updateApiKey,
    toggleLanguage,
    toggleTheme,
    resetAll,
    fetchGeminiResponse
  } = useAppState();

  // Settings Modal State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  // AI Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Fetch district info from database
  const districtIntel = districtsData[selectedDistrict] || districtsData['thiruvarur'];
  const zoneName = agroClimaticZones[districtIntel.zone] || districtIntel.zone;

  // Nav items setup
  const navItems = [
    { path: '/dashboard', label: 'dashboard.title', icon: LayoutDashboard },
    { path: '/fertilizer', label: 'dashboard.modules.fertilizer.title', icon: Sprout },
    { path: '/market', label: 'dashboard.modules.market.title', icon: TrendingUp },
    { path: '/weather', label: 'dashboard.modules.weather.title', icon: CloudSun },
    { path: '/value-added', label: 'dashboard.modules.value_added.title', icon: PackageCheck },
    { path: '/storage', label: 'dashboard.modules.storage.title', icon: Building },
    { path: '/schemes', label: 'dashboard.modules.schemes.title', icon: UserCheck },
    { path: '/officer', label: 'dashboard.modules.officer.title', icon: User },
    { path: '/doctor', label: 'dashboard.modules.doctor.title', icon: Stethoscope },
  ];

  // Set initial greeting once crop/user/district load
  useEffect(() => {
    if (userName && selectedCrop && selectedDistrict) {
      setMessages([
        {
          sender: 'ai',
          text: t('ai.greeting', {
            name: userName,
            crop: t(`crops.${selectedCrop}`),
            district: t(`districts.${selectedDistrict}`)
          })
        }
      ]);
    }
  }, [userName, selectedCrop, selectedDistrict, language]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen, isTyping]);

  const handleLogout = () => {
    resetAll();
    navigate('/onboarding');
  };

  // Real TNAU crop dataset dictionary for Chatbot Quick Queries
  const cropIntel = {
    rice: {
      price: '2,650', diff: '250', msp: '2,400',
      weather: 'Moderate rains are expected soon. Ensure drainage is open to avoid delta crop flooding.',
      pest: 'spray Neem oil (3%) or contact Rice Blast expert Dr. Kalyanasundaram at +91-94425-01234.',
      temp: '14', humidity: '60', dist: '3.5'
    },
    coconut: {
      price: '12,100', diff: '940', msp: '11,160',
      weather: 'Dry wind expected next week. Mulch palm base with coconut coir pith to protect root health.',
      pest: 'watch for Rugose Spiralling Whitefly. Release predatory beetles or spray sharp water jets.',
      temp: '15', humidity: '55', dist: '7.0'
    },
    turmeric: {
      price: '10,200', diff: '2,400', msp: '7,800',
      weather: 'Excess rainfall predicted. Clear soil trenches to protect root rhizomes from rotting.',
      pest: 'apply Trichoderma viride (2.5 kg/acre) mixed with organic manure to manage root rot.',
      temp: '12', humidity: '55', dist: '5.0'
    },
    jasmine: {
      price: '65,000', diff: '25,000', msp: '40,000',
      weather: 'Overcast morning conditions. Restrain watering to avoid floral bud rot.',
      pest: 'spray Bacillus thuringiensis (2g/litre) to control budworm insects.',
      temp: '4', humidity: '90', dist: '2.0'
    },
    cashew: {
      price: '11,800', diff: '2,300', msp: '9,500',
      weather: 'High coastal winds warning. Secure cashew grafts to prevent root snapping.',
      pest: 'swab coal tar + kerosene (1:2 ratio) on the lower trunk to ward off Cashew Stem Borer.',
      temp: '18', humidity: '60', dist: '4.5'
    },
    sugarcane: {
      price: '340', diff: '25', msp: '315',
      weather: 'Moderate coastal winds expected. Tie sugarcane stalks together (propping) to avoid lodging.',
      pest: 'release parasitoid Trichogramma chilonis to suppress internode borer attacks.',
      temp: '10', humidity: '55', dist: '6.0'
    },
    groundnut: {
      price: '7,200', diff: '823', msp: '6,377',
      weather: 'High moisture conditions. Apply Gypsum at 400kg/acre at pegging stage to ensure pod filling.',
      pest: 'drench soil with Trichoderma viride to prevent collar/root rot disease.',
      temp: '15', humidity: '60', dist: '5.0'
    },
    maize: {
      price: '2,300', diff: '210', msp: '2,090',
      weather: 'Moderate humidity. Keep irrigation fields clear to prevent moisture stagnation.',
      pest: 'apply Metarhizium anisopliae or neem formulations early to control Fall Armyworm.',
      temp: '15', humidity: '55', dist: '8.0'
    },
    tea: {
      price: '2,400', diff: '600', msp: '1,800',
      weather: 'Cold night mist warning. Set up shade nets over young tea plants to protect leaves from frost.',
      pest: 'spray wettable sulphur (2g/litre) to treat red spider mite outbreaks.',
      temp: '18', humidity: '45', dist: '12.0'
    },
    potato: {
      price: '2,200', diff: '700', msp: '1,500',
      weather: 'Foggy conditions expected. Spray Mancozeb (2g/litre) to protect from late blight fungal attack.',
      pest: 'use high-grade certified seed tubers and maintain proper soil ridging to control nematodes.',
      temp: '5', humidity: '90', dist: '4.0'
    }
  };

  const currentIntel = cropIntel[selectedCrop] || cropIntel['rice'];

  // Quick replies mapping
  const quickReplies = [
    { key: 'weather', text: t('ai.prompt_weather'), replyKey: 'ai.reply_weather', data: { district: t(`districts.${selectedDistrict}`), crop: t(`crops.${selectedCrop}`), weatherAdvice: currentIntel.weather } },
    { key: 'price', text: t('ai.prompt_price'), replyKey: 'ai.reply_price', data: { crop: t(`crops.${selectedCrop}`), district: t(`districts.${selectedDistrict}`), price: currentIntel.price, diff: currentIntel.diff, msp: currentIntel.msp } },
    { key: 'pest', text: t('ai.prompt_pest'), replyKey: 'ai.reply_pest', data: { crop: t(`crops.${selectedCrop}`), pestAdvice: currentIntel.pest } },
    { key: 'schemes', text: t('ai.prompt_schemes'), replyKey: 'ai.reply_schemes', data: { district: t(`districts.${selectedDistrict}`), crop: t(`crops.${selectedCrop}`) } },
    { key: 'storage', text: t('ai.prompt_storage'), replyKey: 'ai.reply_storage', data: { crop: t(`crops.${selectedCrop}`), humidity: currentIntel.humidity, temp: currentIntel.temp, dist: currentIntel.dist } },
    { key: 'expert', text: t('ai.prompt_expert'), replyKey: 'ai.reply_expert', data: { district: t(`districts.${selectedDistrict}`) } }
  ];

  const triggerQuickReply = (qr) => {
    // Add user message
    const userMsg = { sender: 'user', text: qr.text };
    // Add AI message
    const aiMsg = {
      sender: 'ai',
      text: t(qr.replyKey, qr.data)
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg = { sender: 'user', text: userText };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    if (!apiKey) {
      // Local fall-back warning
      setTimeout(() => {
        const aiMsg = {
          sender: 'ai',
          text: `AgriSmart AI: I am running in Local Expert Mode. To enable 1000x accuracy real-time agronomist diagnostics connected directly to Google Gemini, click the gear icon in the top header and enter your Gemini API Key. Currently, you can click any of the quick queries below for verified TNAU datasets.`
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 500);
      return;
    }

    // Call live API
    setIsTyping(true);
    try {
      const reply = await fetchGeminiResponse(userText, zoneName, districtIntel.soil);
      const aiMsg = { sender: 'ai', text: reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { sender: 'ai', text: `Connection Failed: ${err.message}. Please verify your Gemini API key in settings (top gear icon).` };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-primary/[0.02] dark:bg-brand-darkBg text-brand-primary dark:text-[#EDEFE9] transition-colors duration-200">
      
      {/* 1. Sidebar (Desktop only, hidden on mobile) */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-brand-darkSurface border-r border-brand-borderLight dark:border-brand-borderDark shrink-0 premium-shadow">
        
        {/* Brand header */}
        <div className="p-6 border-b border-brand-borderLight dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary dark:bg-brand-gold flex items-center justify-center text-white dark:text-brand-darkBg font-bold text-base">
              SA
            </div>
            <div className="text-left">
              <span className="text-sm font-bold block">{t('common.app_name')}</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-gold dark:text-brand-goldDark">Tamil Nadu</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg'
                    : 'text-brand-textSecondaryLight hover:bg-brand-primary/5 dark:text-brand-textSecondaryDark dark:hover:bg-brand-gold/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t(item.label)}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 opacity-40 group-hover:translate-x-0.5 ${isActive ? 'opacity-100' : ''}`} />
              </Link>
            );
          })}
        </nav>

        {/* Footer log out */}
        <div className="p-4 border-t border-brand-borderLight dark:border-brand-borderDark space-y-2">
          {/* User profile pill */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-brand-primary/[0.03] dark:bg-brand-gold/[0.03]">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 dark:bg-brand-gold/10 flex items-center justify-center text-brand-primary dark:text-brand-gold font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-left">
              <span className="text-xs font-bold block truncate">{userName}</span>
              <span className="text-[10px] text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80 block truncate">
                {t(`districts.${selectedDistrict}`)}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Change Farmer / Reset</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        
        {/* Topbar Utility Navigation */}
        <header className="sticky top-0 bg-white/80 dark:bg-brand-darkSurface/80 backdrop-blur-md z-30 border-b border-brand-borderLight dark:border-brand-borderDark px-6 py-4 flex items-center justify-between premium-shadow">
          
          {/* Active Context Pill */}
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold md:hidden text-brand-primary dark:text-[#EDEFE9]">
              SA
            </span>
            <div className="h-4 w-px bg-brand-borderLight dark:bg-brand-borderDark md:hidden" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/5 dark:bg-brand-gold/10 border border-brand-borderLight dark:border-brand-borderDark">
              <Sprout className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-xs font-bold text-brand-primary dark:text-[#EDEFE9] whitespace-nowrap">
                {t(`crops.${selectedCrop}`)} · {t(`districts.${selectedDistrict}`)}
              </span>
              <Link 
                to="/crop-recommendation" 
                title={t('dashboard.change_crop')}
                className="ml-1 text-[10px] font-bold text-brand-gold hover:opacity-80 flex items-center gap-0.5 border-l border-brand-borderLight dark:border-brand-borderDark pl-1.5"
              >
                <ArrowLeftRight className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">Change</span>
              </Link>
            </div>
          </div>

          {/* Quick config settings */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface hover:opacity-80 premium-shadow"
              title="AI Settings"
            >
              <Settings className="w-4.5 h-4.5 text-brand-primary dark:text-brand-gold" />
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
            >
              <Languages className="w-3.5 h-3.5 text-brand-gold" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="hidden sm:inline">{t('common.dark')}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-brand-gold" />
                  <span className="hidden sm:inline">{t('common.light')}</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (Visible only on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-brand-darkSurface border-t border-brand-borderLight dark:border-brand-borderDark flex items-center justify-around py-2.5 z-40 premium-shadow">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/dashboard' ? 'text-brand-primary dark:text-brand-gold' : 'text-brand-textSecondaryLight dark:text-brand-textSecondaryDark'
          }`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Home</span>
        </Link>
        <Link
          to="/fertilizer"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/fertilizer' ? 'text-brand-primary dark:text-brand-gold' : 'text-brand-textSecondaryLight dark:text-brand-textSecondaryDark'
          }`}
        >
          <Sprout className="w-4.5 h-4.5" />
          <span>Nutrients</span>
        </Link>
        <Link
          to="/market"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/market' ? 'text-brand-primary dark:text-brand-gold' : 'text-brand-textSecondaryLight dark:text-brand-textSecondaryDark'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" />
          <span>Markets</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Exit</span>
        </button>
      </nav>

      {/* 4. Floating AI Chatbot Assistant */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
        
        {/* Toggle Floating button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg flex items-center justify-center shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-brand-gold cursor-pointer"
        >
          {chatOpen ? <X className="w-6 h-6 animate-spin-once" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>

        {/* Chat Window Panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="absolute right-0 bottom-16 w-80 sm:w-96 h-[500px] bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl shadow-2xl flex flex-col overflow-hidden premium-shadow"
            >
              {/* Header */}
              <div className="bg-brand-primary dark:bg-brand-darkSurface p-4 border-b border-brand-borderLight dark:border-brand-borderDark flex items-center justify-between text-white dark:text-[#EDEFE9]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center text-brand-darkBg font-bold text-xs">
                    AI
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-sm">AgriSmart Assistant</h3>
                    <span className="text-[10px] text-brand-gold dark:text-brand-goldDark font-semibold">
                      Context: {t(`crops.${selectedCrop}`)} · {t(`districts.${selectedDistrict}`)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="hover:opacity-75">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-brand-primary/[0.01]">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed text-left ${
                        msg.sender === 'user'
                          ? 'bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg font-medium rounded-tr-none'
                          : 'bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/5 dark:text-[#EDEFE9] border border-brand-borderLight dark:border-brand-borderDark rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-brand-primary/5 border border-brand-borderLight text-brand-primary dark:border-brand-borderDark rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-semibold animate-pulse text-left">
                      AI is analyzing your crop context...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Contextual Quick Replies Grid */}
              <div className="p-3 border-t border-brand-borderLight dark:border-brand-borderDark bg-brand-primary/[0.02] dark:bg-brand-darkBg/20">
                <span className="text-[9px] uppercase font-bold text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80 block mb-2 px-1 text-left">
                  Quick Query Options
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr.key}
                      onClick={() => triggerQuickReply(qr)}
                      className="px-2.5 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface hover:bg-brand-primary/5 dark:hover:bg-brand-gold/10 text-[10px] font-semibold text-brand-primary dark:text-[#EDEFE9] transition-all"
                    >
                      {qr.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('common.chat_placeholder')}
                  className="flex-1 px-3.5 py-2 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-8.5 h-8.5 rounded-xl bg-brand-primary dark:bg-brand-gold text-white dark:text-brand-darkBg flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal (Radix style overlay) */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl max-w-sm w-full premium-shadow text-left space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-brand-primary dark:text-[#EDEFE9]">AgriSmart Settings</h3>
                <button onClick={() => setSettingsOpen(false)} className="hover:opacity-75">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-relaxed">
                Connect the AI chatbot directly to the live **Google Gemini API** for 1000x accurate diagnostics, insect identification, and soil prescriptions.
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider block text-brand-primary dark:text-[#EDEFE9]">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Paste your Gemini API Key (AIzaSy...)"
                  className="w-full px-3.5 py-2.5 text-xs bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-gold font-medium"
                />
                <span className="text-[9px] text-brand-textSecondaryLight/70 dark:text-brand-textSecondaryDark/70 block mt-1 leading-normal">
                  Secured locally on your browser. Your key is never shared or saved on remote servers.
                </span>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-brand-borderLight dark:border-brand-borderDark text-xs font-semibold hover:bg-brand-primary/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateApiKey(tempKey);
                    setSettingsOpen(false);
                  }}
                  className="px-4 py-2 bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

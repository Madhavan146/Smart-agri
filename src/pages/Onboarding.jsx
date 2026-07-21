import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppState } from '../store.jsx';
import { MapPin, User, ChevronDown, Check, Sun, Moon, Languages, Search, X } from 'lucide-react';

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateOnboarding, language, theme, toggleLanguage, toggleTheme } = useAppState();

  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const districts = [
    'ariyalur', 'chengalpattu', 'chennai', 'coimbatore', 'cuddalore', 
    'dharmapuri', 'dindigul', 'erode', 'kallakurichi', 'kancheepuram', 
    'kanyakumari', 'karur', 'krishnagiri', 'madurai', 'mayiladuthurai', 
    'nagapattinam', 'namakkal', 'nilgiris', 'perambalur', 'pudukkottai', 
    'ramanathapuram', 'ranipet', 'salem', 'sivagangai', 'tenkasi', 
    'thanjavur', 'theni', 'thiruvallur', 'thiruvannamalai', 'thiruvarur', 
    'thoothukudi', 'tiruchirappalli', 'tirunelveli', 'tirupathur', 
    'tiruppur', 'vellore', 'viluppuram', 'virudhunagar'
  ];

  const filteredDistricts = districts.filter(d => {
    const localName = t(`districts.${d}`).toLowerCase();
    const searchVal = searchTerm.toLowerCase();
    return localName.includes(searchVal);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('onboarding.validation_name'));
      return;
    }
    if (!district) {
      setError(t('onboarding.validation_district'));
      return;
    }
    setError('');
    updateOnboarding(name.trim(), district);
    navigate('/crop-recommendation');
  };

  return (
    <div className="min-h-screen bg-brand-primary/5 dark:bg-brand-darkBg flex flex-col justify-between p-6 transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="w-full max-w-lg mx-auto flex justify-end gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
        >
          <Languages className="w-3.5 h-3.5" />
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-brand-primary" />
              <span>{t('common.dark')}</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t('common.light')}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl p-8 premium-shadow"
        >
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-gold dark:text-brand-goldDark mb-2">
              {t('common.app_name')}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-brand-primary dark:text-[#EDEFE9]">
              {t('onboarding.title')}
            </h1>
            <p className="mt-2 text-sm text-brand-textSecondaryLight dark:text-brand-textSecondaryDark font-normal">
              {t('onboarding.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2 text-left">
              <label htmlFor="name-input" className="block text-sm font-semibold tracking-wide text-brand-primary dark:text-[#EDEFE9]">
                {t('onboarding.name_label')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={t('onboarding.name_placeholder')}
                  className="block w-full pl-10 pr-4 py-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-sm font-medium placeholder:text-brand-textSecondaryLight/50 focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all animate-none"
                />
              </div>
            </div>

            {/* Custom Searchable Combobox District Select */}
            <div className="space-y-2 relative text-left">
              <label className="block text-sm font-semibold tracking-wide text-brand-primary dark:text-[#EDEFE9]">
                {t('onboarding.district_label')}
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-sm font-medium text-left focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5 text-brand-textSecondaryLight dark:text-brand-textSecondaryDark" />
                    {district ? t(`districts.${district}`) : <span className="text-brand-textSecondaryLight/50">{t('onboarding.district_placeholder')}</span>}
                  </span>
                  <ChevronDown className={`h-4.5 w-4.5 text-brand-textSecondaryLight transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setSearchTerm(''); }} />
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-xl shadow-lg z-20 overflow-hidden premium-shadow flex flex-col max-h-[300px]">
                      
                      {/* Search Bar Input */}
                      <div className="p-2 border-b border-brand-borderLight dark:border-brand-borderDark bg-brand-primary/[0.01] flex items-center gap-2 sticky top-0 z-10">
                        <Search className="w-4 h-4 text-brand-textSecondaryLight shrink-0" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search district..."
                          className="w-full bg-transparent text-xs focus:outline-none py-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {searchTerm && (
                          <button type="button" onClick={() => setSearchTerm('')} className="text-xs text-brand-textSecondaryLight hover:text-brand-primary">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Dropdown Items List */}
                      <div className="overflow-y-auto divide-y divide-brand-borderLight dark:divide-brand-borderDark flex-1">
                        {filteredDistricts.length > 0 ? (
                          filteredDistricts.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setDistrict(d);
                                setIsOpen(false);
                                setSearchTerm('');
                                if (error) setError('');
                              }}
                              className="flex items-center justify-between w-full px-4 py-3 hover:bg-brand-primary/5 text-left text-sm font-medium transition-colors"
                            >
                              <span>{t(`districts.${d}`)}</span>
                              {district === d && <Check className="w-4 h-4 text-brand-gold" />}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-xs text-center text-brand-textSecondaryLight">
                            No districts found.
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-left">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-darkBg font-semibold py-3 px-4 rounded-xl text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-brand-gold shadow-md"
            >
              {t('onboarding.get_started')}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center py-4 text-xs font-medium text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40">
        © 2026 Tamil Nadu Agriculture Extension Department. Powered by Smart Agri Intelligence.
      </div>
    </div>
  );
}

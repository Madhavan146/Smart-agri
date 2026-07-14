import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppState } from '../store.jsx';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  PackageCheck,
  Building,
  UserCheck,
  User,
  Stethoscope,
  ChevronRight,
  Activity,
  AlertTriangle,
  TrendingDown,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, Line, Cell } from 'recharts';
import { districtsData, agroClimaticZones } from '../data/districtsData.js';

export default function Dashboard() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();

  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  // Fetch dynamic agricultural details from TNAU database
  const districtIntel = districtsData[selectedDistrict] || districtsData['thiruvarur'];
  const cropIntel = districtIntel.crops.find(c => c.id === selectedCrop) || districtIntel.crops[0];
  const zoneName = agroClimaticZones[districtIntel.zone] || districtIntel.zone;

  const priceMap = {
    rice: { msp: 2400, mandi: 2650, corp: 2800 },
    coconut: { msp: 11160, mandi: 12100, corp: 13000 },
    turmeric: { msp: 7800, mandi: 10200, corp: 11500 },
    jasmine: { msp: 40000, mandi: 65000, corp: 45000 },
    cashew: { msp: 9500, mandi: 11800, corp: 12800 },
    sugarcane: { msp: 315, mandi: 340, corp: 360 },
    groundnut: { msp: 6377, mandi: 7200, corp: 7600 },
    maize: { msp: 2090, mandi: 2300, corp: 2500 },
    tea: { msp: 1800, mandi: 2400, corp: 2800 },
    potato: { msp: 1500, mandi: 2200, corp: 2500 }
  };
  const currentPrices = priceMap[selectedCrop] || priceMap['rice'];

  const weatherMap = {
    rice: 'BPH Alert', coconut: 'Dry Wind', turmeric: 'Rot Warning', jasmine: 'Budworm Risk', cashew: 'Borer Warning',
    sugarcane: 'Lodging Risk', groundnut: 'Root Rot', maize: 'Armyworm Alert', tea: 'Frost Risk', potato: 'Blight Warning'
  };
  const currentWeatherBadge = weatherMap[selectedCrop] || 'Stable Skies';

  const tempMap = {
    rice: 14, coconut: 15, turmeric: 12, jasmine: 4, cashew: 18,
    sugarcane: 10, groundnut: 15, maize: 15, tea: 18, potato: 5
  };
  const currentTemp = tempMap[selectedCrop] || 12;

  const officerMap = {
    thiruvarur: 'K. Ranganathan', salem: 'A. Rajkumar', coimbatore: 'R. Senthil', madurai: 'S. Alagarsamy', cuddalore: 'M. Velmurugan',
    thanjavur: 'T. Krishnasamy', nagapattinam: 'V. Sundaram', tiruchirappalli: 'S. Ramalingam', dindigul: 'R. Periyasamy', nilgiris: 'J. Halder'
  };
  const activeOfficerName = officerMap[selectedDistrict] || 'P. Selvam (Agri Officer)';

  // Calculate simulated soil vs target nutrients based on TNAU database
  const soilNutrientData = [
    {
      name: 'Nitrogen (N)',
      actual: Math.round(cropIntel.N * 0.65), // typically deficient
      target: cropIntel.N
    },
    {
      name: 'Phosphorus (P)',
      actual: Math.round(cropIntel.P * 0.82), // slightly deficient
      target: cropIntel.P
    },
    {
      name: 'Potassium (K)',
      actual: Math.round(cropIntel.K * 1.05), // sufficient/slightly high
      target: cropIntel.K
    }
  ];

  // Pricing comparison chart
  const pricingData = [
    { name: 'Govt MSP', price: currentPrices.msp, fill: '#1b7c3f' },
    { name: 'Private Mandi', price: currentPrices.mandi, fill: '#D4AF37' },
    { name: 'Corporate Contract', price: currentPrices.corp, fill: '#3b82f6' }
  ];

  // Modules menu list
  const modules = [
    {
      id: 'fertilizer',
      path: '/fertilizer',
      title: t('dashboard.modules.fertilizer.title'),
      desc: t('dashboard.modules.fertilizer.desc', { crop: cropName, district: districtName }),
      icon: Sprout,
      badge: `NPK: ${cropIntel.N}-${cropIntel.P}-${cropIntel.K}`
    },
    {
      id: 'market',
      path: '/market',
      title: t('dashboard.modules.market.title'),
      desc: t('dashboard.modules.market.desc', { crop: cropName, district: districtName }),
      icon: TrendingUp,
      badge: `₹${currentPrices.mandi.toLocaleString('en-IN')} / Qtl`
    },
    {
      id: 'weather',
      path: '/weather',
      title: t('dashboard.modules.weather.title'),
      desc: t('dashboard.modules.weather.desc', { crop: cropName }),
      icon: CloudSun,
      badge: `29°C · ${currentWeatherBadge}`
    },
    {
      id: 'value-added',
      path: '/value-added',
      title: t('dashboard.modules.value_added.title'),
      desc: t('dashboard.modules.value_added.desc', { crop: cropName }),
      icon: PackageCheck,
      badge: '3x Margins'
    },
    {
      id: 'storage',
      path: '/storage',
      title: t('dashboard.modules.storage.title'),
      desc: t('dashboard.modules.storage.desc', { crop: cropName, district: districtName }),
      icon: Building,
      badge: `${currentTemp}°C Cap`
    },
    {
      id: 'schemes',
      path: '/schemes',
      title: t('dashboard.modules.schemes.title'),
      desc: t('dashboard.modules.schemes.desc', { crop: cropName }),
      icon: UserCheck,
      badge: 'Active Benefits'
    },
    {
      id: 'officer',
      path: '/officer',
      title: t('dashboard.modules.officer.title'),
      desc: t('dashboard.modules.officer.desc', { district: districtName }),
      icon: User,
      badge: activeOfficerName.split(' ')[0]
    },
    {
      id: 'doctor',
      path: '/doctor',
      title: t('dashboard.modules.doctor.title'),
      desc: t('dashboard.modules.doctor.desc', { crop: cropName }),
      icon: Stethoscope,
      badge: 'Expert Active'
    }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Editorial Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-brand-borderLight dark:border-brand-borderDark pb-6 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold dark:text-brand-goldDark mb-1 block">
            {t('common.welcome')} · {t('common.active')}
          </span>
          <h1 className="text-3xl font-extrabold text-brand-primary dark:text-[#EDEFE9] tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-brand-textSecondaryLight dark:text-brand-textSecondaryDark mt-1 font-normal">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Global info pills */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="px-3.5 py-1.5 bg-brand-primary/5 dark:bg-brand-gold/10 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs font-bold text-brand-primary dark:text-brand-gold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('dashboard.current_crop_pill', { crop: cropName })}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-brand-primary/5 dark:bg-brand-gold/10 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs font-bold text-brand-primary dark:text-brand-gold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>{t('dashboard.current_district_pill', { district: districtName })}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI) Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Suitability Index */}
        <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
              Suitability Rating
            </span>
            <span className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9] block mt-1">
              {cropIntel.rate}% Matches
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Agro-Zone: {zoneName.split(' (')[0]}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Live Market average */}
        <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
              Mandi Average Price
            </span>
            <span className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9] block mt-1 tabular-nums">
              ₹{currentPrices.mandi.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-brand-gold font-semibold block mt-1">
              MSP: ₹{currentPrices.msp.toLocaleString('en-IN')} (Floor)
            </span>
          </div>
          <div className="p-3 bg-yellow-500/10 text-brand-gold rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Weather risk index */}
        <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
              Soil Climate Alert
            </span>
            <span className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9] block mt-1">
              {currentWeatherBadge}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold block mt-1">
              Temp threshold: {currentTemp}°C cap
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <CloudSun className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Interactive Data Analytics Section (Charts Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Soil vs Target Nutrients Composed Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-4">
          <div className="flex justify-between items-center border-b border-brand-borderLight dark:border-brand-borderDark pb-3">
            <div>
              <h2 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9] uppercase tracking-wider">
                TNAU Soil Nutrient Deficit Analysis
              </h2>
              <span className="text-[10px] text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80">
                District Soil Profile: {districtIntel.soil}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/10 dark:text-brand-gold block">
              {cropName} Target
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={soilNutrientData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(11, 61, 32, 0.03)" />
                <XAxis dataKey="name" stroke="#8fa396" fontSize={10} tickLine={false} />
                <YAxis stroke="#8fa396" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#101F16', borderColor: 'rgba(212, 175, 55, 0.12)', borderRadius: '8px' }}
                  labelStyle={{ color: '#EDEFE9', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                <Bar dataKey="actual" name="Actual Soil Nutrient" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={25} />
                <Line type="monotone" dataKey="target" name="Recommended Target" stroke="#1b7c3f" strokeWidth={3} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Channels Comparison Bar Chart (Span 1) */}
        <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-4">
          <div className="border-b border-brand-borderLight dark:border-brand-borderDark pb-3">
            <h2 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9] uppercase tracking-wider">
              Market Price Comparison
            </h2>
            <span className="text-[10px] text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80">
              ₹ per Quintal / Tonne
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricingData} margin={{ top: 15, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#8fa396" fontSize={9} tickLine={false} />
                <YAxis stroke="#8fa396" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#101F16', borderColor: 'rgba(212, 175, 55, 0.12)', borderRadius: '8px' }}
                  labelStyle={{ color: '#EDEFE9', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#C9A93E', fontSize: '11px' }}
                />
                <Bar dataKey="price" radius={[5, 5, 0, 0]}>
                  {pricingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Modules Bento Grid Navigation (Clean, scoped sub-cards) */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80">
          Command Terminal Modules
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -2 }}
                className="group"
              >
                <Link
                  to={mod.path}
                  className="flex flex-col justify-between h-[150px] p-5 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-xl premium-shadow hover:border-brand-primary/30 dark:hover:border-brand-gold/30 transition-all text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="p-2 bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/5 dark:text-brand-gold rounded-lg">
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/5 dark:text-brand-gold">
                        {mod.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-brand-primary dark:text-[#EDEFE9] group-hover:text-brand-gold transition-colors line-clamp-1">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-[10px] text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-normal line-clamp-2">
                      {mod.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

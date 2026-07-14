import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppState } from '../store.jsx';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, CalendarRange, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { districtsData } from '../data/districtsData.js';

export default function FertilizerRecommendation() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();

  const [acres, setAcres] = useState(1);
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  // Fetch from TNAU database
  const districtIntel = districtsData[selectedDistrict] || districtsData['thiruvarur'];
  const cropData = districtIntel.crops.find(c => c.id === selectedCrop) || districtIntel.crops[0];

  const getUnit = (cropId) => {
    if (cropId === 'coconut') return 'g/palm/year';
    if (cropId === 'jasmine') return 'g/bush/year';
    if (cropId === 'cashew') return 'g/tree/year';
    return 'kg/ha';
  };
  const cropUnit = getUnit(selectedCrop);

  // Calculated fertilizer doses per acre (read from db and scaled by acreage)
  const calcUrea = Math.round(cropData.ureaPerAcre * acres);
  const calcSsp = Math.round(cropData.sspPerAcre * acres);
  const calcMop = Math.round(cropData.mopPerAcre * acres);

  const chartData = [
    { name: t('fertilizer.nitrogen'), value: cropData.N, fill: '#1b7c3f' },
    { name: t('fertilizer.phosphorus'), value: cropData.P, fill: '#D4AF37' },
    { name: t('fertilizer.potassium'), value: cropData.K, fill: '#3b82f6' }
  ];

  const handleAcresChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setAcres(val);
    } else {
      setAcres(0);
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-borderLight dark:border-brand-borderDark pb-6 gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-brand-primary dark:text-[#EDEFE9] rounded-xl premium-shadow hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold dark:text-brand-goldDark">
              {t('common.personalized_for', { crop: cropName, district: districtName })}
            </span>
            <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9] tracking-tight">
              {t('fertilizer.title')}
            </h1>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl p-6 premium-shadow flex flex-col lg:flex-row gap-8 text-left">
        
        {/* Left Side: Stats and Info */}
        <div className="flex-1 space-y-5">
          <div className="flex items-start gap-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] p-4 rounded-xl border border-brand-borderLight dark:border-brand-borderDark">
            <Info className="w-5 h-5 text-brand-gold mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
              {t('fertilizer.deficiency_reason', {
                soilType: districtIntel.soil,
                district: districtName,
                crop: cropName
              })}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm text-brand-primary dark:text-[#EDEFE9]">
              {t('fertilizer.npk_target')}
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F7F5F0] dark:bg-[#15271D] p-4 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-center premium-shadow">
                <span className="text-[10px] font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
                  {t('fertilizer.nitrogen')}
                </span>
                <span className="text-2xl font-extrabold text-[#1b7c3f] block mt-1 tabular-nums">
                  {cropData.N}
                </span>
                <span className="text-[9px] font-bold text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40">
                  {cropUnit}
                </span>
              </div>

              <div className="bg-[#F7F5F0] dark:bg-[#15271D] p-4 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-center premium-shadow">
                <span className="text-[10px] font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
                  {t('fertilizer.phosphorus')}
                </span>
                <span className="text-2xl font-extrabold text-[#9e8020] dark:text-brand-goldDark block mt-1 tabular-nums">
                  {cropData.P}
                </span>
                <span className="text-[9px] font-bold text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40">
                  {cropUnit}
                </span>
              </div>

              <div className="bg-[#F7F5F0] dark:bg-[#15271D] p-4 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-center premium-shadow">
                <span className="text-[10px] font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
                  {t('fertilizer.potassium')}
                </span>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 block mt-1 tabular-nums">
                  {cropData.K}
                </span>
                <span className="text-[9px] font-bold text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40">
                  {cropUnit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Recharts split */}
        <div className="w-full lg:w-[350px] flex flex-col justify-center border border-brand-borderLight dark:border-brand-borderDark rounded-xl p-4 bg-brand-primary/[0.01]">
          <h4 className="text-xs font-bold text-center mb-4 uppercase tracking-wider text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
            Nutrient Ratio Chart
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#8fa396" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa396" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101F16', borderColor: 'rgba(212, 175, 55, 0.12)', borderRadius: '8px' }}
                  labelStyle={{ color: '#EDEFE9', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#C9A93E', fontSize: '11px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Calculator Section */}
      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl p-6 premium-shadow space-y-6 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
            <Calculator className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-primary dark:text-[#EDEFE9]">
              {t('fertilizer.calculator_title')}
            </h2>
            <p className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark mt-0.5">
              {t('fertilizer.calculator_desc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Input field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-brand-primary dark:text-[#EDEFE9] uppercase tracking-wider">
              {t('common.acres')}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={acres}
              onChange={handleAcresChange}
              className="block w-full px-4 py-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
            />
          </div>

          {/* Calculator Output summary */}
          <div className="md:col-span-2 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] p-5 rounded-xl border border-brand-borderLight dark:border-brand-borderDark flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark uppercase block">
                Calculated Formula (Acreage Scoped)
              </span>
              <p className="text-xs font-semibold text-brand-primary dark:text-[#EDEFE9] leading-relaxed">
                {t('fertilizer.calculate_result', {
                  acres: acres,
                  crop: cropName,
                  urea: calcUrea,
                  ssp: calcSsp,
                  mop: calcMop,
                  micronutrients: cropData.micro
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soil Application Schedule Timeline */}
      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl p-6 premium-shadow space-y-6 text-left">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 text-brand-primary dark:bg-brand-gold/10 dark:text-brand-gold rounded-xl">
            <CalendarRange className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-primary dark:text-[#EDEFE9]">
              {t('fertilizer.schedule_title')}
            </h2>
            <span className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark mt-0.5">
              {t('fertilizer.current_stage', { stage: t('fertilizer.growth_stages.vegetative') })}
            </span>
          </div>
        </div>

        {/* Timeline representation */}
        <div className="relative border-l-2 border-brand-primary/10 dark:border-brand-gold/20 ml-4 space-y-8 py-2">
          {/* Day 1 Basal */}
          <div className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 rounded-full bg-brand-primary dark:bg-brand-gold border-4 border-white dark:border-brand-darkSurface" />
            <h3 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
              Stage 1: Basal Application (Day 1)
            </h3>
            <p className="mt-1 text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark font-normal leading-relaxed">
              {t('fertilizer.schedule_day_1')}
            </p>
          </div>

          {/* Day 30 First Top */}
          <div className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 rounded-full bg-brand-gold dark:bg-brand-goldDark border-4 border-white dark:border-brand-darkSurface" />
            <h3 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
              Stage 2: First Top Dressing (Day 30 - Tillering / Active Growth)
            </h3>
            <p className="mt-1 text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark font-normal leading-relaxed">
              {t('fertilizer.schedule_day_30')}
            </p>
          </div>

          {/* Day 60 Second Top */}
          <div className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 rounded-full bg-brand-primary/20 dark:bg-[#203D2E] border-4 border-white dark:border-brand-darkSurface" />
            <h3 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
              Stage 3: Second Top Dressing (Day 60 - Flowering / Head Development)
            </h3>
            <p className="mt-1 text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark font-normal leading-relaxed">
              {t('fertilizer.schedule_day_60')}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppState } from '../store.jsx';
import { Check, ArrowRight, AlertCircle } from 'lucide-react';
import { districtsData, agroClimaticZones } from '../data/districtsData.js';

export default function CropRecommendation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedDistrict, updateCrop } = useAppState();

  const [activeCrop, setActiveCrop] = useState('');

  // Read agricultural details from TNAU database
  const districtIntel = districtsData[selectedDistrict] || districtsData['thiruvarur'];
  const currentRecommendations = districtIntel.crops;
  const zoneName = agroClimaticZones[districtIntel.zone] || districtIntel.zone;

  const handleConfirm = () => {
    if (!activeCrop) return;
    updateCrop(activeCrop);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-primary/[0.02] dark:bg-brand-darkBg py-12 px-6 flex items-center justify-center transition-colors duration-200">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Step Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 dark:bg-brand-gold/10 text-brand-primary dark:text-brand-gold text-xs font-semibold uppercase tracking-wider">
            Step 2: Crop Suitability
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-brand-primary dark:text-[#EDEFE9]">
            {t('recommendation.title')}
          </h1>
          <p className="text-sm text-brand-textSecondaryLight dark:text-brand-textSecondaryDark max-w-lg mx-auto font-normal">
            {t('recommendation.subtitle', { district: `${t(`districts.${selectedDistrict}`)} (${zoneName})` })}
          </p>
        </div>

        {/* Informative Soils Alert */}
        <div className="flex gap-3 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-4 rounded-xl premium-shadow items-start">
          <AlertCircle className="w-5 h-5 text-brand-gold dark:text-brand-goldDark mt-0.5 shrink-0" />
          <div className="text-sm text-left">
            <span className="font-bold text-brand-primary dark:text-[#EDEFE9] block mb-1">
              {t('recommendation.soil_type_info', { soilType: t(`recommendation.soil_types.${selectedDistrict}`) || districtIntel.soil })}
            </span>
            <p className="text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-relaxed">
              {t('recommendation.description', { district: t(`districts.${selectedDistrict}`) })}
            </p>
          </div>
        </div>

        {/* Top 5 list */}
        <div className="space-y-3.5">
          {currentRecommendations.map((crop, idx) => {
            const isSelected = activeCrop === crop.id;
            return (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => setActiveCrop(crop.id)}
                className={`group cursor-pointer flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-brand-darkSurface border rounded-xl premium-shadow transition-all ${
                  isSelected
                    ? 'border-brand-primary ring-2 ring-brand-primary/10 dark:border-brand-gold dark:ring-brand-gold/10'
                    : 'border-brand-borderLight dark:border-brand-borderDark hover:border-brand-primary/40 dark:hover:border-brand-gold/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar / Index Indicator */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    isSelected 
                      ? 'bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg' 
                      : 'bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/5 dark:text-brand-gold'
                  }`}>
                    {idx + 1}
                  </div>
                  
                  {/* Crop Info */}
                  <div className="text-left">
                    <h3 className="font-bold text-base text-brand-primary dark:text-[#EDEFE9]">
                      {t(`crops.${crop.id}`)}
                    </h3>
                    <p className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark mt-0.5 capitalize">
                      Ideal Soil Condition: {crop.soil.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                {/* Progress bar success-rate */}
                <div className="mt-4 md:mt-0 flex items-center gap-4 w-full md:w-60">
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-brand-textSecondaryLight/80 dark:text-brand-textSecondaryDark/80">
                        {t('recommendation.success_rate')}
                      </span>
                      <span className="text-brand-primary dark:text-[#EDEFE9] tabular-nums">
                        {crop.rate}%
                      </span>
                    </div>
                    <div className="w-full bg-brand-primary/10 dark:bg-[#203D2E] h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${crop.rate}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${
                          crop.rate >= 90
                            ? 'bg-[#1b7c3f] dark:bg-[#28ad5e]'
                            : crop.rate >= 80
                            ? 'bg-brand-gold dark:bg-brand-goldDark'
                            : 'bg-amber-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Radio check icon */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'border-brand-primary bg-brand-primary text-white dark:border-brand-gold dark:bg-brand-gold dark:text-brand-darkBg' 
                      : 'border-brand-borderLight dark:border-brand-borderDark group-hover:border-brand-primary/60 dark:group-hover:border-brand-gold/60'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={!activeCrop}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl text-sm transition-all shadow-md ${
              activeCrop
                ? 'bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-darkBg cursor-pointer'
                : 'bg-brand-primary/10 text-brand-primary/40 dark:bg-brand-gold/10 dark:text-brand-gold/30 cursor-not-allowed'
            }`}
          >
            <span>{t('recommendation.confirm_selection')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

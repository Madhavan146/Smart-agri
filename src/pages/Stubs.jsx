import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppState } from '../store.jsx';
import {
  ArrowLeft,
  CloudRain,
  Sun,
  Layers,
  PhoneCall,
  MessageSquare,
  Building2,
  CheckCircle,
  Award
} from 'lucide-react';

// 1. Weather Recommendation Stub
export function WeatherStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  const advisories = {
    rice: 'high humidity (>85%) and Samba season rains increase BPH (Brown Plant Hopper) vulnerability. Keep water levels at 2cm and spray Neem oil (3%) immediately.',
    coconut: 'high temperatures and dry wind can accelerate button shedding. Apply mulching with coconut coir pith and add 50g Borax per tree.',
    turmeric: 'heavy water logging expected in clayey soils. Ensure proper field drainage to prevent Rhizome Rot (Erwinia carotovora).',
    jasmine: 'cloudy skies and high humidity increase Bud Worm infestation. Spray Bacillus thuringiensis or neem formulation.',
    cashew: 'post-monsoon humidity increases Cashew Stem and Root Borer vulnerability. Swab the trunk with neem oil emulsion.'
  };

  const warning = advisories[selectedCrop] || advisories['rice'];
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('weather.title')}
          </h1>
        </div>
      </div>

      {/* Advisory card */}
      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-4">
        <div className="flex items-center gap-2 text-brand-gold">
          <CloudRain className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider">{t('weather.alert_label')}</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
          {t('weather.alert', { district: districtName, crop: cropName, warning: warning })}
        </p>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((day, idx) => (
          <div key={day} className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-4 rounded-xl text-center premium-shadow">
            <span className="text-xs font-bold text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block">
              {t(`weather.day_${day}`)}
            </span>
            <div className="my-3 flex justify-center text-brand-gold">
              {idx % 3 === 0 ? <CloudRain className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-brand-gold" />}
            </div>
            <span className="text-sm font-extrabold block text-brand-primary dark:text-[#EDEFE9]">
              {idx % 3 === 0 ? '26°C' : '32°C'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Value-Added Product Explorer Stub
export function ValueAddedStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('value_added.title')}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-brand-gold" />
          <h2 className="text-base font-bold text-brand-primary dark:text-[#EDEFE9]">
            Processing & Packaging Ideas
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
          {t('value_added.recommendation', {
            crop: cropName,
            district: districtName,
            products: t(`value_added.products.${selectedCrop}`)
          })}
        </p>

        {/* Processing step suggestion card */}
        <div className="bg-brand-primary/[0.02] dark:bg-brand-gold/[0.02] border border-brand-borderLight dark:border-brand-borderDark p-5 rounded-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-gold mb-2">Step-by-Step Micro-Factory Setup</h3>
          <ul className="text-xs space-y-2.5 text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-relaxed">
            <li><strong>1. Harvesting & Selection:</strong> Grade yields immediately. Only Grade-A goes to mandi; Grade-B and C are selected for value addition.</li>
            <li><strong>2. Processing Station:</strong> Washing, peeling, dehydrated drying, or seed crushing depending on standard manuals.</li>
            <li><strong>3. Branding:</strong> Register under FSSAI and pack with Tamil Nadu Agriculture marketing support bags.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 3. Storage & Warehouse Guide Stub
export function StorageStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  const storageParams = {
    rice: { temp: '14', humidity: '60', name1: 'TNWC Kudavasal Storage Yard', name2: 'Mannargudi Regulated Market Yard', name3: 'Needamangalam Food Grains Silo' },
    coconut: { temp: '15', humidity: '55', name1: 'Pollachi Market Committee Yard', name2: 'TNWC Negamam Warehouses', name3: 'Coimbatore Copra Drying Hub' },
    turmeric: { temp: '12', humidity: '55', name1: 'Attur Market Committee Yard', name2: 'Salem Central Dry Warehouse', name3: 'Erode Turmeric Storage Ltd' },
    jasmine: { temp: '4', humidity: '90', name1: 'Integrated Flower Market Cold Storage', name2: 'Mattuthavani Flower Yard Cold Room', name3: 'Madurai Scent Extraction Cold Box' },
    cashew: { temp: '18', humidity: '60', name1: 'Panruti Regulated Market Cashew Yard', name2: 'TNWC Neyveli Storage Depot', name3: 'Cuddalore Coastal Cashew Storage' }
  };

  const currentParams = storageParams[selectedCrop] || storageParams['rice'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('storage.title')}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-brand-gold" />
          <h2 className="text-base font-bold text-brand-primary dark:text-[#EDEFE9]">
            Ideal Environmental Parameters
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
          {t('storage.thresholds', { crop: cropName, temp: currentParams.temp, humidity: currentParams.humidity })}
        </p>

        <div className="border-t border-brand-borderLight dark:border-brand-borderDark pt-6">
          <h3 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9] mb-4">
            Nearest Cold Storages & Warehouses
          </h3>
          <div className="space-y-3.5">
            {[1, 2, 3].map((num) => {
              const name = num === 1 ? currentParams.name1 : num === 2 ? currentParams.name2 : currentParams.name3;
              return (
                <div key={num} className="bg-brand-primary/[0.01] border border-brand-borderLight dark:border-brand-borderDark p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand-primary dark:text-[#EDEFE9]">
                      {name}
                    </h4>
                    <span className="text-[10px] text-brand-textSecondaryLight dark:text-brand-textSecondaryDark block mt-1">
                      {t('storage.nearest_warehouse', { name: name, district: districtName, dist: num * 3.5 })}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    Space Available
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Govt Schemes & Benefits Stub
export function SchemesStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  const schemeLists = {
    rice: [
      { name: 'Paddy Seed Multiplication Subsidy', desc: 'Offers a 50% discount on high-yielding ADT/CO seed varieties through the local Agriculture Extension Center.' },
      { name: 'National Food Security Mission (NFSM) Paddy Grants', desc: 'Financial support of ₹5,000 per hectare for mechanical line transplanting and system of rice intensification (SRI).' },
      { name: 'TN Crop Insurance (PMFBY Samba Scheme)', desc: 'Guarantees payout up to ₹32,000 per acre in case of water deficit or storm damage in the Cauvery Delta region.' }
    ],
    coconut: [
      { name: 'Coconut Development Board (CDB) Replanting Grant', desc: 'Financial aid of ₹250 per palm tree for replacing old, senile palms with hybrid Tall x Dwarf seedlings.' },
      { name: 'TNSAMB Neera Extraction Licencing Support', desc: 'Subsidized training and toolkits for tapping Neera and producing coconut palm sugar.' },
      { name: 'Drip Irrigation subsidy under PMKSY', desc: 'Provides 100% subsidy for small/marginal farmers and 75% for other farmers for setting up sub-surface drip networks.' }
    ],
    turmeric: [
      { name: 'National Horticulture Mission (NHM) Rhizome Subsidy', desc: 'Subsidizes 40% of the cost of purchasing disease-free turmeric seed rhizomes from regulated nurseries.' },
      { name: 'Solar Crop Dryer Subsidy', desc: 'Provides a 50% capital subsidy (up to ₹1.5 Lakhs) for building solar poly-carbonate dome dryers for turmeric curing.' },
      { name: 'Turmeric Crop Loan Interes Subvention', desc: 'Cooperative banks offer credit at a reduced 4% interest rate for crop weights stored in regulated warehouses.' }
    ],
    jasmine: [
      { name: 'MIDH Floriculture Development Scheme', desc: 'Capital subsidy of ₹16,000 per acre for installing trellis, weed-mats, and hybrid planting material.' },
      { name: 'Refrigerated Transport Van Subsidy', desc: 'Provides up to 35% financial assistance to Farmer Producer Organisations (FPOs) for cold-chain transport.' },
      { name: 'Jasmine Drip Irrigation Grant', desc: 'Provides 100% subsidy on micro-sprinkler installations to conserve water and boost bud size.' }
    ],
    cashew: [
      { name: 'Laterite Soil Cashew Replanting Subsidy', desc: 'Provides ₹12,000 per hectare to clear older seedling plantations and replace with high-yielding VRI-3 grafts.' },
      { name: 'Cashew Processing Unit Subsidy', desc: 'Assists FPOs with a 40% subsidy to set up local roasting, peeling, and vacuum-packaging mini-factories.' },
      { name: 'Soil Reclamation Lime Subsidy', desc: 'Provides free agricultural lime inputs to neutralize soil acidity in Cuddalore cashew blocks.' }
    ]
  };

  const eligibleSchemes = schemeLists[selectedCrop] || schemeLists['rice'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('schemes.title')}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-brand-gold" />
          <h2 className="text-base font-bold text-brand-primary dark:text-[#EDEFE9]">
            Eligible Subsidies & Benefits
          </h2>
        </div>

        <p className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
          Below schemes are pre-filtered based on your profile as a local cultivator of {cropName} in the {districtName} district.
        </p>

        <div className="space-y-4">
          {eligibleSchemes.map((scheme, index) => (
            <div key={index} className="border border-brand-borderLight dark:border-brand-borderDark p-4.5 rounded-xl bg-brand-primary/[0.01]">
              <h3 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
                {scheme.name}
              </h3>
              <p className="mt-1 text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-relaxed">
                {scheme.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. District Agri Officer Portal Stub
export function OfficerStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  const officerDirectory = {
    thiruvarur: { name: 'K. Ranganathan', phone: '+91-94425-01234' },
    salem: { name: 'A. Rajkumar', phone: '+91-94432-87654' },
    coimbatore: { name: 'R. Senthil', phone: '+91-94440-12345' },
    madurai: { name: 'S. Alagarsamy', phone: '+91-94421-45678' },
    cuddalore: { name: 'M. Velmurugan', phone: '+91-94451-98765' }
  };

  const activeOfficer = officerDirectory[selectedDistrict] || officerDirectory['thiruvarur'];

  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceList, setGrievanceList] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;

    const newId = Math.floor(1000 + Math.random() * 9000);
    const newGrievance = {
      id: newId,
      text: grievanceText.trim(),
      date: new Date().toLocaleDateString(),
      status: 'Submitted'
    };

    setGrievanceList(prev => [newGrievance, ...prev]);
    setSuccessMsg(t('officer.grievance_success', { id: newId }));
    setGrievanceText('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 6000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('officer.title')}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Officer details card */}
        <div className="bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 dark:bg-brand-gold/10 flex items-center justify-center font-bold text-brand-primary dark:text-brand-gold text-lg">
              {activeOfficer.name.charAt(0)}
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
                {activeOfficer.name}
              </h2>
              <span className="text-[10px] text-brand-gold font-semibold uppercase block">
                Agri Extension Representative
              </span>
            </div>
          </div>

          <p className="text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark leading-relaxed">
            {t('officer.officer_assigned', { name: activeOfficer.name })}
          </p>

          <div className="flex gap-3">
            <a
              href={`tel:${activeOfficer.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-2 px-4 rounded-xl text-xs font-bold hover:opacity-90"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('common.call')}</span>
            </a>
            <a
              href={`https://wa.me/${activeOfficer.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 px-4 rounded-xl text-xs font-bold hover:opacity-90"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('common.whatsapp')}</span>
            </a>
          </div>
        </div>

        {/* Grievance form (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark p-6 rounded-2xl premium-shadow space-y-6">
          <h2 className="text-base font-bold text-brand-primary dark:text-[#EDEFE9]">
            {t('officer.grievance_title')}
          </h2>

          <form onSubmit={handleGrievanceSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-primary dark:text-[#EDEFE9] uppercase tracking-wider">
                {t('officer.grievance_label')}
              </label>
              <textarea
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder={t('officer.grievance_placeholder')}
                rows="4"
                className="block w-full p-4 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
              />
            </div>

            {successMsg && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg rounded-xl text-xs font-bold hover:opacity-90"
            >
              {t('officer.grievance_submit')}
            </button>
          </form>

          {/* Grievance List Tracker */}
          {grievanceList.length > 0 && (
            <div className="border-t border-brand-borderLight dark:border-brand-borderDark pt-6">
              <h3 className="text-xs font-bold text-brand-primary dark:text-[#EDEFE9] uppercase tracking-wider mb-4">
                Submitted Grievance Records
              </h3>
              <div className="space-y-3">
                {grievanceList.map((g) => (
                  <div key={g.id} className="border border-brand-borderLight dark:border-brand-borderDark p-4 rounded-xl flex items-center justify-between bg-brand-primary/[0.01]">
                    <div>
                      <span className="text-xs font-bold text-brand-primary dark:text-[#EDEFE9]">
                        Case ID: #SA-2026-{g.id}
                      </span>
                      <p className="text-[11px] text-brand-textSecondaryLight dark:text-brand-textSecondaryDark mt-1 font-normal line-clamp-1">
                        {g.text}
                      </p>
                      <span className="text-[9px] text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40 block mt-1">
                        Submitted: {g.date}
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                      {g.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// 6. Doctor Agri Chat Stub
export function DoctorStub() {
  const { t } = useTranslation();
  const { selectedCrop, selectedDistrict } = useAppState();
  const cropName = t(`crops.${selectedCrop}`);
  const districtName = t(`districts.${selectedDistrict}`);

  const specialists = {
    rice: 'M. Kalyanasundaram (Rice Blast Specialist)',
    coconut: 'K. Ruba (Palm Weevil Pathologist)',
    turmeric: 'S. Jayaraman (Rhizome Rot Specialist)',
    jasmine: 'P. Anandhi (Budworm Entomologist)',
    cashew: 'V. Sundararaju (Cashew Stem Borer Entomologist)'
  };

  const doctorName = specialists[selectedCrop] || specialists['rice'];
  const welcomeText = t('doctor.chat_context', { crop: cropName, district: districtName });

  const [docMessages, setDocMessages] = useState([
    { sender: 'doc', text: t('doctor.doctor_assigned', { name: doctorName }) },
    { sender: 'doc', text: welcomeText }
  ]);
  const [docInput, setDocInput] = useState('');

  const handleSendDocMessage = (e) => {
    e.preventDefault();
    if (!docInput.trim()) return;

    const userMsg = { sender: 'user', text: docInput.trim() };
    const docReply = {
      sender: 'doc',
      text: `Dr. ${doctorName.split(' ')[1]}: I have received your query on your ${cropName} in ${districtName}. Please share a photo of the leaves or bark showing symptoms, and details of your last nitrogen application so we can verify the pathogen.`
    };

    setDocMessages(prev => [...prev, userMsg, docReply]);
    setDocInput('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-3 border-b border-brand-borderLight dark:border-brand-borderDark pb-6">
        <Link to="/dashboard" className="p-2 border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface rounded-xl premium-shadow">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
            {t('common.personalized_for', { crop: cropName, district: districtName })}
          </span>
          <h1 className="text-2xl font-extrabold text-brand-primary dark:text-[#EDEFE9]">
            {t('doctor.title')}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl overflow-hidden flex flex-col h-[550px] premium-shadow">
        
        {/* Doctor Header */}
        <div className="bg-brand-primary/5 dark:bg-brand-darkSurface/50 p-4 border-b border-brand-borderLight dark:border-brand-borderDark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
              Dr
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-brand-primary dark:text-[#EDEFE9]">
                Dr. {doctorName.split(' (')[0]}
              </h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                {t('doctor.doctor_online')}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-brand-primary/[0.01]">
          {docMessages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed text-left ${
                m.sender === 'user'
                  ? 'bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg font-medium rounded-tr-none'
                  : 'bg-brand-primary/5 text-brand-primary dark:bg-brand-gold/5 dark:text-[#EDEFE9] border border-brand-borderLight dark:border-brand-borderDark rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendDocMessage} className="p-4 border-t border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface flex gap-2">
          <input
            type="text"
            value={docInput}
            onChange={(e) => setDocInput(e.target.value)}
            placeholder="Describe your plant pathology issue..."
            className="flex-1 px-4 py-2.5 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-transparent font-medium"
          />
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:text-brand-darkBg px-5 rounded-xl text-xs font-bold transition-all shrink-0"
          >
            {t('doctor.send_msg')}
          </button>
        </form>

      </div>
    </div>
  );
}

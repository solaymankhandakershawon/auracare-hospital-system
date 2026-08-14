import React, { useState } from 'react';
import { 
  Search, 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Award, 
  CheckCircle2,
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const HeroBanner: React.FC<{ onSearchSerial: (token: string) => void }> = ({ onSearchSerial }) => {
  const { language, t, hospitalStats, setActiveTab } = useHospital();
  const [quickToken, setQuickToken] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickToken.trim()) {
      onSearchSerial(quickToken.trim());
      setActiveTab('queue');
    }
  };

  return (
    <div className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-200 pt-10 pb-14 px-4 sm:px-6">
      {/* Decorative subtle ambient modern blue/emerald background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {language === 'bn' ? 'স্মার্ট ও ডিজিটাল স্বাস্থ্যসেবার বিশ্বস্ত ঠিকানা' : 'Next-Gen Smart Healthcare & Telemedicine'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
              {language === 'bn' ? (
                <>
                  সহজে নিন <span className="text-sky-600 font-extrabold">ডাক্তারের সিরিয়াল</span> ও লাইভ ট্র্যাকিং
                </>
              ) : (
                <>
                  Effortless <span className="text-sky-600 font-extrabold">Doctor Serial Booking</span> & Live Queue
                </>
              )}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {language === 'bn' 
                ? 'দীর্ঘক্ষণ লাইনে না দাঁড়িয়ে ঘরে বসেই দেশের শীর্ষ বিশেষজ্ঞ ডাক্তারদের সিরিয়াল নিন, সরাসরি রানিং সিরিয়াল ট্র্যাক করুন, ডিজিটাল প্রেসক্রিপশন সংরক্ষণ করুন এবং এইচডি ভিডিও কনসাল্টেশন গ্রহণ করুন।'
                : 'Skip the long waiting lines. Reserve doctor serials from anywhere, monitor real-time chamber queues, secure your lifetime medical vault, and consult specialists over HD video.'}
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'স্বয়ংক্রিয় এসএমএস ও হোয়াটসঅ্যাপ নোটিফিকেশন' : 'Automated SMS & WhatsApp Alerts'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'bn' ? '২-ফ্যাক্টর ডাটা নিরাপত্তা' : '2-Factor Security Protected'}</span>
              </div>
            </div>

            {/* Quick Serial Search Bar */}
            <div className="pt-2">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={quickToken}
                    onChange={(e) => setQuickToken(e.target.value)}
                    placeholder={language === 'bn' ? 'টোকেন কোড দিন (যেমন: AUR-8412)...' : 'Enter Token Code (e.g. AUR-8412)...'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{t.trackSerialBtn}</span>
                </button>
              </form>
            </div>

            {/* CTA Button Group */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('doctor-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-sky-100" />
                <span>{t.bookSerialBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('ai-triage')}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{t.aiSymptomCheckerTitle}</span>
              </button>
            </div>
          </div>

          {/* Professional Live Stats Bento Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100/50 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {language === 'bn' ? 'লাইভ হসপিটাল কন্ট্রোল স্ট্যাটাস' : 'Live Hospital Activity Monitor'}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      {language === 'bn' ? 'সিস্টেম সক্রিয় ও নিরবচ্ছিন্ন' : 'System Active & Real-Time'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                    <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                    {language === 'bn' ? 'বিশেষজ্ঞ চিকিৎসক' : 'Specialist Doctors'}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {hospitalStats.totalDoctors}+
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'bn' ? 'সকল প্রধান বিভাগে' : 'Across 8 Super-Wings'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'bn' ? 'আজকের সিরিয়াল সেবা' : 'Patients Served Today'}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                    {hospitalStats.todayPatientsServed}+
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'bn' ? 'সফল সেবা সম্পন্ন' : 'Completed Serials'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-sky-600" />
                    {language === 'bn' ? 'সক্রিয় চেম্বার' : 'Active Chambers'}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-sky-600">
                    {hospitalStats.activeChambers}
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'bn' ? 'লাইভ কিউ মনিটরিং' : 'Chambers in Session'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    {language === 'bn' ? 'জরুরি আইসিইউ বেড' : 'Available ICU Beds'}
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-600">
                    {hospitalStats.icuAvailable} <span className="text-xs font-normal text-slate-500">Available</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{language === 'bn' ? '২৪/৭ প্রস্তুত টিম' : 'Instant Critical Care'}</span>
                </div>
              </div>

              {/* Security & Backup banner */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white text-emerald-600 shadow-xs border border-emerald-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">
                      {language === 'bn' ? 'এনক্রিপ্টেড ক্লাউড ব্যাকআপ সক্রিয়' : 'End-to-End Encrypted Cloud Storage'}
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      {language === 'bn' ? 'আপনার সকল মেডিকেল ডাটা স্বয়ংক্রিয়ভাবে সংরক্ষিত' : 'Prescriptions and lab reports auto-synced'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

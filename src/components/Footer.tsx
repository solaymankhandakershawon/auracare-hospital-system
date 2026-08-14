import React from 'react';
import { 
  HeartPulse, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Award,
  Video,
  FileText
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const Footer: React.FC = () => {
  const { language, t, setActiveTab } = useHospital();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-14 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">AuraCare Hospital</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            {language === 'bn' 
              ? 'আন্তর্জাতিক মানের চিকিৎসাসেবা, বিশেষজ্ঞ চিকিৎসকদের নির্ভরযোগ্য সিরিয়াল ও নিরাপদ ডিজিটাল হেলথ রেকর্ড সিস্টেম।' 
              : 'Premier super-specialty healthcare, real-time doctor serial booking, encrypted medical records vault, and HD telemedicine.'}
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'স্বয়ংক্রিয় ব্যাকআপ ও ২-ফ্যাক্টর নিরাপত্তা সক্রিয়' : '2FA Protected & Auto-Backed Up'}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-sm">
            {language === 'bn' ? 'গুরুত্বপূর্ণ সেবা' : 'Core Services'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer">
                {t.navHome}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('queue')} className="hover:text-white transition-colors cursor-pointer">
                {t.navQueue}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('records')} className="hover:text-white transition-colors cursor-pointer">
                {t.navRecords}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('telemedicine')} className="hover:text-white transition-colors cursor-pointer">
                {t.navTelemedicine}
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('doctor-dashboard')} className="hover:text-white transition-colors cursor-pointer">
                {t.navDoctorPortal}
              </button>
            </li>
          </ul>
        </div>

        {/* Chambers & Emergency */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-sm">
            {language === 'bn' ? 'জরুরি ও অ্যাম্বুলেন্স' : 'Emergency & Trauma'}
          </h4>
          <p className="text-rose-400 font-bold text-sm">
            Hotline: 10668 (24/7)
          </p>
          <p className="text-slate-200 text-xs font-mono font-medium">
            Ambulance: +880 9611-888999
          </p>
          <p className="text-slate-400 text-xs">
            ICU & CCU Hotline: Ext. 401/402
          </p>
        </div>

        {/* Hospital Address */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-sm">
            {language === 'bn' ? 'ঠিকানা ও অবস্থান' : 'Chamber Location'}
          </h4>
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Plot #14, Road #11, Block-C, Gulshan-2, Dhaka-1212, Bangladesh</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-mono text-slate-300">care@auracare-hospital.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Chambers: 08:00 AM - 11:00 PM Daily</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} AuraCare Super-Speciality Hospital & Telemedicine System. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400 font-medium">● ISO 9001:2015 Certified</span>
          <span className="text-sky-400 font-medium">● 2FA Data Secured</span>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { 
  HeartPulse, 
  PhoneCall, 
  Globe, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  CloudCheck, 
  Video, 
  FileText, 
  Clock, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const Navbar: React.FC<{ onOpenBackupModal: () => void; onOpen2FAModal: () => void }> = ({
  onOpenBackupModal,
  onOpen2FAModal,
}) => {
  const { 
    language, 
    setLanguage, 
    t, 
    user, 
    setUser, 
    notifications, 
    markNotificationRead,
    activeTab, 
    setActiveTab, 
    isBackingUp, 
    lastBackupTime,
    showToast
  } = useHospital();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
    showToast(next === 'bn' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language switched to English', 'info');
  };

  const toggleRole = () => {
    const nextRole = user.role === 'patient' ? 'doctor' : 'patient';
    setUser(prev => ({ ...prev, role: nextRole }));
    if (nextRole === 'doctor') {
      setActiveTab('doctor-dashboard');
      showToast(language === 'bn' ? 'ডক্টরস ড্যাশবোর্ডে প্রবেশ করেছেন' : "Switched to Doctor's Portal", 'success');
    } else {
      setActiveTab('home');
      showToast(language === 'bn' ? 'রোগী ভিউতে ফিরে এসেছেন' : 'Switched to Patient Portal', 'info');
    }
  };

  const navItems = [
    { id: 'home', label: t.navHome, icon: HeartPulse },
    { id: 'queue', label: t.navQueue, icon: Clock },
    { id: 'records', label: t.navRecords, icon: FileText },
    { id: 'telemedicine', label: t.navTelemedicine, icon: Video },
    { id: 'ai-triage', label: t.navAiTriage, icon: Sparkles },
    { id: 'doctor-dashboard', label: t.navDoctorPortal, icon: Stethoscope },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs transition-all">
      {/* Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency Hotline */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              <PhoneCall className="w-3 h-3 mr-1" />
              {t.emergency247}:
            </span>
            <a href="tel:10668" className="text-slate-900 font-bold hover:text-sky-600 tracking-wider transition-colors">
              10668 / +880 9611-888999
            </a>
          </div>

          {/* Cloud Backup status & 2FA badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Automated Cloud Server Backup"
            >
              <CloudCheck className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin text-sky-600' : 'text-emerald-600'}`} />
              <span className="hidden sm:inline text-[11px] font-semibold">
                {isBackingUp ? (language === 'bn' ? 'ব্যাকআপ সিঙ্ক হচ্ছে...' : 'Backing up...') : `${t.backupSynced} (${lastBackupTime})`}
              </span>
            </button>

            <button
              onClick={onOpen2FAModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
              title="2-Factor Authentication Security"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline text-[11px] font-semibold">{t.twoFactorActive}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white p-0.5 shadow-sm group-hover:bg-sky-700 transition-colors flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                AuraCare
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 border border-sky-200 text-sky-800 uppercase tracking-wider">
                Hospital
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              {language === 'bn' ? 'সুপার স্পেশালাইজড হসপিটাল ও স্মার্ট সিরিয়াল' : 'Super Specialized Care & Telemedicine'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:border-sky-500 hover:text-sky-600 transition-all shadow-xs cursor-pointer"
            title={t.switchRole}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">
              {user.role === 'patient' ? t.actingAsPatient : t.actingAsDoctor}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
            title="Toggle Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Notification Hub */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                if (unreadCount > 0) markNotificationRead();
              }}
              className="relative p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-sky-600 hover:border-sky-500 transition-all cursor-pointer shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">{t.notificationsTitle}</span>
                  </div>
                  <button 
                    onClick={() => markNotificationRead()}
                    className="text-[11px] text-sky-600 hover:underline font-semibold cursor-pointer"
                  >
                    {t.markAllRead}
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      কোনো নতুন নোটিফিকেশন নেই
                    </div>
                  ) : (
                    notifications.slice(0, 6).map(n => (
                      <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.read ? 'bg-sky-50/60' : ''}`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            n.type === 'SMS' ? 'bg-sky-100 text-sky-800' :
                            n.type === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                            n.type === 'EMAIL' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {n.type}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 mb-0.5">{language === 'bn' ? n.titleBn : n.title}</p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{language === 'bn' ? n.messageBn : n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {language === 'bn' ? '✓ এসএমএস ও হোয়াটসঅ্যাপ ডিসপ্যাচ কানেক্টেড' : '✓ SMS & WhatsApp Live Dispatch Active'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white border border-slate-300 lg:hidden text-slate-800 hover:text-sky-600 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

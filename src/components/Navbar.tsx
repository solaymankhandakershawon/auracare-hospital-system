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
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E1D8] text-[#1B2430] shadow-sm transition-all">
      {/* Top Utility Bar */}
      <div className="bg-[#F9F7F2] border-b border-[#EDE8DF] px-4 py-1.5 text-xs text-[#5C6573]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency Hotline */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              <PhoneCall className="w-3 h-3 mr-1" />
              {t.emergency247}:
            </span>
            <a href="tel:10668" className="text-[#1B2430] font-bold hover:text-[#C5A059] tracking-wider transition-colors">
              10668 / +880 9611-888999
            </a>
          </div>

          {/* Cloud Backup status & 2FA badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3F0] border border-[#1B4D3E]/20 text-[#1B4D3E] hover:bg-[#DCEEE7] transition-colors"
              title="Automated Cloud Server Backup"
            >
              <CloudCheck className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin text-[#C5A059]' : 'text-[#1B4D3E]'}`} />
              <span className="hidden sm:inline text-[11px] font-medium">
                {isBackingUp ? (language === 'bn' ? 'ব্যাকআপ সিঙ্ক হচ্ছে...' : 'Backing up...') : `${t.backupSynced} (${lastBackupTime})`}
              </span>
            </button>

            <button
              onClick={onOpen2FAModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4EAD4] border border-[#C5A059]/30 text-[#8C6B28] hover:bg-[#ECDDBE] transition-colors"
              title="2-Factor Authentication Security"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A8833C]" />
              <span className="hidden md:inline text-[11px] font-medium">{t.twoFactorActive}</span>
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
          <div className="w-10 h-10 rounded-xl bg-[#F4EAD4] border border-[#C5A059]/40 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-[#A8833C] group-hover:text-[#1B4D3E] transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1B2430]">
                AuraCare
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F4EAD4] border border-[#C5A059]/30 text-[#8C6B28] uppercase tracking-widest">
                Hospital
              </span>
            </div>
            <p className="text-[11px] text-[#5C6573] hidden sm:block font-medium">
              {language === 'bn' ? 'সুপার স্পেশালাইজড হসপিটাল ও স্মার্ট সিরিয়াল' : 'Super Specialized Care & Telemedicine'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl p-1 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1B2430] text-[#FDFCFB] font-bold shadow-sm'
                    : 'text-[#5C6573] hover:text-[#1B2430] hover:bg-[#EDE8DF]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#8C6B28]'}`} />
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F9F7F2] border border-[#E5E1D8] text-[#1B2430] hover:border-[#C5A059] hover:bg-[#F1EDE4] transition-all shadow-sm cursor-pointer"
            title={t.switchRole}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#A8833C]" />
            <span className="hidden sm:inline">
              {user.role === 'patient' ? t.actingAsPatient : t.actingAsDoctor}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] hover:bg-[#ECDDBE] transition-all cursor-pointer"
            title="Toggle Language (বাংলা / English)"
          >
            <Globe className="w-3.5 h-3.5 text-[#A8833C]" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Notification Hub */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                if (unreadCount > 0) markNotificationRead();
              }}
              className="relative p-2 rounded-lg bg-[#F9F7F2] border border-[#E5E1D8] text-[#1B2430] hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all cursor-pointer"
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
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#1B2430]">
                <div className="px-4 py-3 bg-[#F9F7F2] border-b border-[#E5E1D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#A8833C]" />
                    <span className="text-xs font-bold text-[#1B2430]">{t.notificationsTitle}</span>
                  </div>
                  <button 
                    onClick={() => markNotificationRead()}
                    className="text-[11px] text-[#A8833C] hover:underline font-semibold"
                  >
                    {t.markAllRead}
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#EDE8DF]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#5C6573]">
                      কোনো নতুন নোটিফিকেশন নেই
                    </div>
                  ) : (
                    notifications.slice(0, 6).map(n => (
                      <div key={n.id} className={`p-3 text-xs hover:bg-[#F9F7F2] transition-colors ${!n.read ? 'bg-[#F4EAD4]/40' : ''}`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            n.type === 'SMS' ? 'bg-sky-100 text-sky-800' :
                            n.type === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                            n.type === 'EMAIL' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {n.type}
                          </span>
                          <span className="text-[10px] text-[#5C6573]">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="font-semibold text-[#1B2430] mb-0.5">{language === 'bn' ? n.titleBn : n.title}</p>
                        <p className="text-[#5C6573] text-[11px] leading-relaxed">{language === 'bn' ? n.messageBn : n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-[#F9F7F2] border-t border-[#E5E1D8] text-center">
                  <span className="text-[11px] text-[#1B4D3E] font-semibold">
                    {language === 'bn' ? '✓ এসএমএস ও হোয়াটসঅ্যাপ ডিসপ্যাচ কানেক্টেড' : '✓ SMS & WhatsApp Live Dispatch Active'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#F9F7F2] border border-[#E5E1D8] lg:hidden text-[#1B2430] hover:text-[#C5A059]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E5E1D8] px-4 py-3 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-[#1B2430] text-[#FDFCFB] font-bold'
                    : 'text-[#5C6573] hover:bg-[#F9F7F2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#8C6B28]'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

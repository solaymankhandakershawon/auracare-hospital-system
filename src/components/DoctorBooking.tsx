import React, { useState } from 'react';
import { 
  HeartPulse, 
  Brain, 
  Stethoscope, 
  Bone, 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  UserCheck, 
  ChevronRight, 
  Search,
  Filter
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Doctor } from '../types';

export const DoctorBooking: React.FC<{
  onSelectDoctor: (doctor: Doctor, type?: 'in-person' | 'video') => void;
}> = ({ onSelectDoctor }) => {
  const { language, t, doctors, departments } = useHospital();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [telemedicineOnly, setTelemedicineOnly] = useState<boolean>(false);

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return HeartPulse;
      case 'Brain': return Brain;
      case 'Stethoscope': return Stethoscope;
      case 'Bone': return Bone;
      case 'Baby': return Baby;
      case 'Sparkles': return Sparkles;
      case 'ShieldCheck': return ShieldCheck;
      case 'Activity': return Activity;
      default: return Stethoscope;
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nameBn.includes(searchQuery) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialtyBn.includes(searchQuery) ||
      doc.chamber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTelemedicine = !telemedicineOnly || doc.telemedicineAvailable;
    return matchesDept && matchesSearch && matchesTelemedicine;
  });

  return (
    <section id="doctor-directory-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5 text-[#A8833C]" />
            <span>{language === 'bn' ? 'বিশেষজ্ঞ চিকিৎসক মণ্ডলী' : 'Renowned Specialist Faculty'}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2430] tracking-tight">
            {language === 'bn' ? 'ডাক্তারের সিরিয়াল বুকিং ও চেম্বার শিডিউল' : 'Find Your Specialist & Book Serial'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6573] mt-1 max-w-xl">
            {language === 'bn' 
              ? 'পছন্দের বিশেষজ্ঞ ডাক্তার নির্বাচন করুন, রানিং সিরিয়াল পর্যবেক্ষণ করুন এবং তাত্ক্ষণিক ডিজিটাল টোকেন গ্রহণ করুন।' 
              : 'Choose your desired doctor, monitor active serial slots in real-time, and get your digital token.'}
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8833C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchDoctorPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059] shadow-xs"
            />
          </div>

          <button
            onClick={() => setTelemedicineOnly(!telemedicineOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              telemedicineOnly 
                ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] font-bold shadow-xs' 
                : 'bg-[#FFFFFF] text-[#1B2430] border-[#E5E1D8] hover:border-[#C5A059]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-inherit" />
            <span>{language === 'bn' ? 'শুধু ভিডিও কনসাল্ট' : 'Video Consult Only'}</span>
          </button>
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-[#1B2430] text-[#FDFCFB] border-[#1B2430] shadow-sm'
                : 'bg-[#FFFFFF] text-[#5C6573] border-[#E5E1D8] hover:border-[#C5A059] hover:bg-[#F9F7F2]'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#C5A059]" />
            <span>{t.allDepartments}</span>
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${selectedDept === 'all' ? 'bg-[#333E4D] text-white' : 'bg-[#F9F7F2] text-[#5C6573]'}`}>
              {doctors.length}
            </span>
          </button>

          {departments.map((dept) => {
            const Icon = getDepartmentIcon(dept.iconName);
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B2430] text-[#FDFCFB] border-[#1B2430] font-bold shadow-sm'
                    : 'bg-[#FFFFFF] text-[#5C6573] border-[#E5E1D8] hover:border-[#C5A059] hover:bg-[#F9F7F2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C5A059]' : 'text-[#8C6B28]'}`} />
                <span>{language === 'bn' ? dept.nameBn : dept.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? 'bg-[#333E4D] text-white' : 'bg-[#F9F7F2] text-[#5C6573]'}`}>
                  {dept.doctorCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#FFFFFF] rounded-2xl border border-[#E5E1D8] text-[#5C6573]">
            <Filter className="w-8 h-8 mx-auto mb-2 text-[#A8833C]" />
            <p className="text-sm font-semibold">{language === 'bn' ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No doctors found matching criteria'}</p>
            <p className="text-xs text-[#5C6573] mt-1">{language === 'bn' ? 'অনুগ্রহ করে সার্চ কীওয়ার্ড বা ফিল্টার পরিবর্তন করুন।' : 'Try adjusting your search terms or filter.'}</p>
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const waitingCount = Math.max(0, doc.totalSerialsToday - doc.currentSerialServing);
            return (
              <div 
                key={doc.id}
                className="bg-[#FFFFFF] hover:bg-[#FDFCFB] border border-[#E5E1D8] hover:border-[#C5A059] rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5E1D8] shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-[#1B4D3E] text-white text-[9px] font-bold tracking-wider flex items-center gap-0.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        LIVE
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[#A8833C] text-xs font-semibold mb-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                        <span>{doc.rating}</span>
                        <span className="text-[#5C6573] font-normal">({doc.reviewCount})</span>
                        <span className="text-[#E5E1D8]">•</span>
                        <span className="text-[#5C6573]">{doc.experienceYears}+ {t.experienceYears}</span>
                      </div>

                      <h3 className="font-serif font-bold text-[#1B2430] text-base group-hover:text-[#A8833C] transition-colors truncate">
                        {language === 'bn' ? doc.nameBn : doc.name}
                      </h3>

                      <p className="text-xs text-[#8C6B28] font-semibold truncate">
                        {language === 'bn' ? doc.specialtyBn : doc.specialty}
                      </p>

                      <p className="text-[11px] text-[#5C6573] truncate mt-0.5 font-sans">
                        {doc.degree}
                      </p>
                    </div>
                  </div>

                  {/* Chamber & Schedule Info */}
                  <div className="space-y-2 bg-[#F9F7F2] p-3 rounded-xl border border-[#E5E1D8] mb-4 text-xs">
                    <div className="flex items-center justify-between text-[#1B2430]">
                      <span className="flex items-center gap-1.5 text-[#5C6573] text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#A8833C]" />
                        {language === 'bn' ? doc.chamberBn : doc.chamber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E1D8] text-[#1B2430] font-mono text-[10px] font-bold">
                        {doc.roomNo}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#1B2430]">
                      <span className="flex items-center gap-1.5 text-[#5C6573] text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#1B4D3E]" />
                        {language === 'bn' ? doc.timeSlotBn : doc.timeSlot}
                      </span>
                      <span className="text-[10px] text-[#5C6573] font-medium">
                        {doc.availableDays.length} {language === 'bn' ? 'দিন খোলা' : 'days/wk'}
                      </span>
                    </div>
                  </div>

                  {/* Live Serial Status Badge */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-[#F4EAD4]/50 border border-[#C5A059]/30 p-2.5 rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-[#5C6573] block font-medium">{t.currentServing}</span>
                      <div className="text-lg font-bold font-serif text-[#8C6B28] flex items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-ping inline-block" />
                        #{doc.currentSerialServing}
                      </div>
                    </div>
                    <div className="border-l border-[#C5A059]/30">
                      <span className="text-[10px] text-[#5C6573] block font-medium">{t.waitingPatients}</span>
                      <div className="text-lg font-bold font-serif text-[#1B2430]">
                        {waitingCount} {language === 'bn' ? 'জন' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Fee */}
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs text-[#5C6573] font-medium">{t.consultationFee}:</span>
                    <span className="text-base font-bold text-[#1B2430] font-serif">
                      {t.bdt} {doc.consultationFee}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectDoctor(doc, 'in-person')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{language === 'bn' ? 'সিরিয়াল বুকিং' : 'Book Serial'}</span>
                    </button>

                    <button
                      onClick={() => onSelectDoctor(doc, 'video')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#EBF3F0] hover:bg-[#DCEEE7] border border-[#1B4D3E]/30 text-[#1B4D3E] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'ভিডিও কনসাল্ট' : 'Video Consult'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

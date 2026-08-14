import React from 'react';
import { 
  X, 
  CloudCheck, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  HardDrive, 
  Database, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const BackupManagerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { 
    language, 
    isBackingUp, 
    lastBackupTime, 
    triggerServerBackup, 
    appointments, 
    medicalRecords, 
    doctors,
    showToast
  } = useHospital();

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      hospital: 'AuraCare Super Specialty Hospital',
      appointments,
      medicalRecords,
      doctors,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraCare_Hospital_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(language === 'bn' ? 'ডাটা ব্যাকআপ ফাইল ডাউনলোড হয়েছে' : 'Backup snapshot exported to JSON', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 text-[#1B2430] space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-4">
          <div className="flex items-center gap-2.5">
            <CloudCheck className="w-6 h-6 text-[#1B4D3E]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1B2430]">
                {language === 'bn' ? 'সার্ভার ডাটা ব্যাকআপ ম্যানেজার' : 'Cloud Server Backup & Persistence'}
              </h3>
              <p className="text-[11px] text-[#5C6573]">
                {language === 'bn' ? 'স্বয়ংক্রিয় ব্যাকআপ ও অফলাইন রিকভারি' : 'Automatic Encrypted Server Synchronization'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#5C6573] hover:text-[#1B2430] hover:bg-[#F1EDE4] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="p-4 rounded-xl bg-[#EBF3F0] border border-[#C2DCD2] flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wider font-mono">Backup Status:</span>
            <h4 className="font-serif text-base font-bold text-[#1B2430] flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#1B4D3E]" />
              <span>{language === 'bn' ? 'সার্ভারে সফলভাবে ব্যাকআপ সংরক্ষিত' : 'Synced with Hospital Server'}</span>
            </h4>
            <p className="text-xs text-[#5C6573] mt-1">Last synced at: <strong className="text-[#8C6B28] font-mono">{lastBackupTime}</strong></p>
          </div>
          <button
            onClick={triggerServerBackup}
            disabled={isBackingUp}
            className="p-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] transition-all cursor-pointer shadow-xs"
            title="Sync Now"
          >
            <RefreshCw className={`w-5 h-5 ${isBackingUp ? 'animate-spin text-[#C5A059]' : ''}`} />
          </button>
        </div>

        {/* Backup metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
            <span className="text-[#5C6573] text-[10px] block font-medium uppercase tracking-wider">Appointments</span>
            <span className="font-serif font-bold text-[#8C6B28] text-xl mt-0.5 block">{appointments.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
            <span className="text-[#5C6573] text-[10px] block font-medium uppercase tracking-wider">Vault Records</span>
            <span className="font-serif font-bold text-[#1B4D3E] text-xl mt-0.5 block">{medicalRecords.length}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8]">
            <span className="text-[#5C6573] text-[10px] block font-medium uppercase tracking-wider">Chambers</span>
            <span className="font-serif font-bold text-[#1B2430] text-xl mt-0.5 block">{doctors.length}</span>
          </div>
        </div>

        {/* Export JSON action */}
        <div className="pt-1">
          <button
            onClick={handleExportJSON}
            className="w-full py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F1EDE4] text-[#1B2430] font-semibold text-xs flex items-center justify-center gap-2 border border-[#E5E1D8] cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#8C6B28]" />
            <span>{language === 'bn' ? 'সম্পূর্ণ ডাটা স্ন্যাপশট এক্সপোর্ট (JSON)' : 'Export Full Snapshot (JSON)'}</span>
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#EDE8DF]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] text-xs font-bold rounded-xl cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

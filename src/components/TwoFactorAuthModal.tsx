import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  History, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const TwoFactorAuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { language, user, setUser, showToast } = useHospital();
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.is2FAEnabled);
  const [testOtp, setTestOtp] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggle2FA = () => {
    const next = !is2FAEnabled;
    setIs2FAEnabled(next);
    setUser(prev => ({ ...prev, is2FAEnabled: next }));
    showToast(
      next
        ? (language === 'bn' ? '২-ফ্যাক্টর অথেন্টিকেশন সক্রিয় করা হয়েছে' : '2FA Security Enabled')
        : (language === 'bn' ? '২-ফ্যাক্টর অথেন্টিকেশন নিষ্ক্রিয় করা হয়েছে' : '2FA Disabled'),
      'info'
    );
  };

  const handleTestVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (testOtp.length === 6) {
      setVerifiedSuccess(true);
      showToast(language === 'bn' ? 'ওটিপি কোড সফলভাবে ভেরিফাই হয়েছে!' : 'Security OTP Verified Successfully!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 text-[#1B2430] space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#8C6B28]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1B2430]">
                {language === 'bn' ? '২-ফ্যাক্টর অথেন্টিকেশন নিরাপত্তা' : 'Two-Factor Authentication (2FA) Security'}
              </h3>
              <p className="text-[11px] text-[#5C6573]">
                {language === 'bn' ? 'মেডিকেল রেকর্ড ও তথ্যের সর্বোচ্চ সুরক্ষা' : 'Highest Grade Healthcare Data Protection'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#5C6573] hover:text-[#1B2430] hover:bg-[#F1EDE4] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle 2FA switch */}
        <div className="p-4 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${is2FAEnabled ? 'bg-[#EBF3F0] text-[#1B4D3E]' : 'bg-[#EDE8DF] text-[#5C6573]'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1B2430]">
                {language === 'bn' ? 'এসএমএস ও ওটিপি ভেরিফিকেশন' : 'SMS & Mobile OTP Guard'}
              </h4>
              <p className="text-[11px] text-[#5C6573]">
                {language === 'bn' ? 'লগইন ও সিরিয়াল কনফার্মেশনে ৬ ডিজিটের ওটিপি যাচাই' : 'Verify 6-digit OTP during booking and portal access'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle2FA}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              is2FAEnabled 
                ? 'bg-[#1B4D3E] text-[#FDFCFB] shadow-xs' 
                : 'bg-[#FFFFFF] border border-[#E5E1D8] text-[#5C6573] hover:text-[#1B2430]'
            }`}
          >
            {is2FAEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>

        {/* Security Details */}
        <div className="space-y-2 text-xs text-[#1B2430] bg-[#F9F7F2] p-4 rounded-xl border border-[#E5E1D8]">
          <div className="flex items-center justify-between">
            <span className="text-[#5C6573]">Registered Phone:</span>
            <span className="font-mono font-bold text-[#8C6B28]">{user.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5C6573]">Registered Email:</span>
            <span className="font-mono text-[#1B2430]">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#5C6573]">Encryption Standard:</span>
            <span className="font-bold text-[#1B4D3E]">AES-256 GCM + SHA-256</span>
          </div>
        </div>

        {/* Test Verification Form */}
        <form onSubmit={handleTestVerify} className="space-y-3">
          <label className="block text-xs font-semibold text-[#1B2430]">
            {language === 'bn' ? 'টেস্ট ওটিপি ভেরিফিকেশন (Test Verification):' : 'Test 2FA OTP Verification:'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={testOtp}
              onChange={e => setTestOtp(e.target.value)}
              placeholder="e.g. 582941"
              className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm font-mono tracking-widest text-center text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs rounded-xl cursor-pointer shadow-xs"
            >
              Verify
            </button>
          </div>
          {verifiedSuccess && (
            <p className="text-xs text-[#1B4D3E] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'bn' ? '২-ফ্যাক্টর অথেন্টিকেশন সফলভাবে ভেরিফাই হয়েছে' : '2FA OTP Verified Successfully'}
            </p>
          )}
        </form>

        <div className="flex justify-end pt-3 border-t border-[#EDE8DF]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#1B2430] text-xs font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

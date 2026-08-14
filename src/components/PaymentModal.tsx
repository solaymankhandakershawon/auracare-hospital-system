import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Video,
  Wallet
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Appointment, PaymentGateway } from '../types';

export const PaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}> = ({ isOpen, onClose, appointment }) => {
  const { language, t, confirmPayment } = useHospital();

  const [selectedMethod, setSelectedMethod] = useState<PaymentGateway>('bKash');
  const [walletPhone, setWalletPhone] = useState('01712345678');
  const [walletPin, setWalletPin] = useState('••••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [generatedTrxId, setGeneratedTrxId] = useState('');

  if (!isOpen || !appointment) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const trx = 'TRX' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setGeneratedTrxId(trx);

    setTimeout(async () => {
      await confirmPayment(appointment.id, selectedMethod, trx);
      setIsProcessing(false);
      setPaymentDone(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {language === 'bn' ? 'অনলাইন কনসালটেন্সি পেমেন্ট গেটওয়ে' : 'Online Consultation Payment Gateway'}
              </h3>
              <p className="text-[11px] text-sky-700 font-semibold">
                {appointment.type === 'video' ? (language === 'bn' ? 'ভিডিও কনসালটেন্সি ফি' : 'Telemedicine Fee') : (language === 'bn' ? 'অনলাইন ফি ক্লিয়ারেন্স' : 'Online Fee Clearance')}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!paymentDone ? (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Fee summary card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">{appointment.doctorName}</span>
                  <span className="text-xs text-sky-700 font-bold">Serial #{appointment.serialNumber} ({appointment.tokenCode})</span>
                  {appointment.type === 'video' && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                      <Video className="w-3 h-3" /> {language === 'bn' ? 'অনলাইন ভিডিও সেশন' : 'Online Video Session'}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">{t.consultationFee}</span>
                  <span className="text-xl font-extrabold text-slate-900">৳{appointment.amount}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  {language === 'bn' ? 'পেমেন্ট মেথড বেছে নিন:' : 'Select Payment Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash', active: 'border-pink-600 bg-pink-50 text-pink-700 font-bold' },
                    { id: 'Nagad', label: 'Nagad', active: 'border-orange-600 bg-orange-50 text-orange-700 font-bold' },
                    { id: 'Card', label: 'Card', active: 'border-sky-600 bg-sky-50 text-sky-700 font-bold' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedMethod === m.id
                          ? `${m.active} shadow-xs`
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet phone & PIN input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold">
                    {selectedMethod} {language === 'bn' ? 'অ্যাকাউন্ট নম্বর' : 'Wallet Account Number'}
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={walletPhone}
                      onChange={e => setWalletPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold">
                    {language === 'bn' ? 'সিকিউরিটি পিন (ডেমো)' : 'Security PIN (Simulated)'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={walletPin}
                      onChange={e => setWalletPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit SSL Encrypted Hospital Checkout</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2 transition-all"
              >
                {isProcessing ? (
                  <span>{language === 'bn' ? 'পেমেন্ট প্রক্রিয়াধীন...' : 'Processing Payment...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <span>
                      {language === 'bn' ? `৳${appointment.amount} পরিশোধ করুন (${selectedMethod})` : `Pay ৳${appointment.amount} via ${selectedMethod}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  {language === 'bn' ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Payment Successful!'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'bn' ? 'আপনার ডিজিটাল মানি রিসিট প্রস্তুত করা হয়েছে।' : 'Your official payment receipt has been generated.'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'ট্রানজেকশন আইডি:' : 'Transaction ID:'}</span>
                  <span className="font-mono font-bold text-sky-700">{generatedTrxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'পরিশোধিত অর্থ:' : 'Amount Paid:'}</span>
                  <span className="font-extrabold text-slate-900">৳{appointment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'পেমেন্ট মেথড:' : 'Method:'}</span>
                  <span className="font-bold text-slate-800">{selectedMethod}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-600" />
                  <span>{language === 'bn' ? 'রিসিপ্ট প্রিন্ট' : 'Print Receipt'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
                >
                  {language === 'bn' ? 'সম্পন্ন' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

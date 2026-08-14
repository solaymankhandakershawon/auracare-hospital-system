import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Printer, 
  Download,
  AlertCircle
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2430]/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative text-[#1B2430] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#F9F7F2] border-b border-[#EDE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#8C6B28]" />
            <h3 className="font-serif font-bold text-[#1B2430] text-sm sm:text-base">
              {language === 'bn' ? 'অনলাইন হসপিটাল পেমেন্ট গেটওয়ে' : 'Hospital Online Payment Gateway'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#5C6573] hover:text-[#1B2430] hover:bg-[#F1EDE4] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!paymentDone ? (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Fee summary card */}
              <div className="bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-[#5C6573] block">{appointment.doctorName}</span>
                  <span className="font-serif text-xs text-[#8C6B28] font-bold">Serial #{appointment.serialNumber} ({appointment.tokenCode})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#5C6573] block">{t.consultationFee}</span>
                  <span className="font-serif text-xl font-bold text-[#1B4D3E]">৳{appointment.amount}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#1B2430] mb-2">
                  {language === 'bn' ? 'পেমেন্ট গেটওয়ে বেছে নিন:' : 'Select Payment Gateway:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', label: 'bKash' },
                    { id: 'Nagad', label: 'Nagad' },
                    { id: 'Card', label: 'Card' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedMethod === m.id
                          ? 'border-[#C5A059] bg-[#F4EAD4] text-[#8C6B28] shadow-xs'
                          : 'border-[#E5E1D8] bg-[#FFFFFF] text-[#5C6573] hover:text-[#1B2430]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet phone & PIN input */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-[#5C6573] mb-1 font-medium">
                    {selectedMethod} Wallet Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={walletPhone}
                    onChange={e => setWalletPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#5C6573] mb-1 font-medium">
                    Security PIN (Simulated)
                  </label>
                  <input
                    type="password"
                    required
                    value={walletPin}
                    onChange={e => setWalletPin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#5C6573] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#1B4D3E]" />
                <span>256-bit SSL Encrypted Hospital Checkout</span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2 transition-all"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Pay ৳{appointment.amount} via {selectedMethod}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#EBF3F0] border-2 border-[#1B4D3E] text-[#1B4D3E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-[#1B2430]">Payment Successful!</h4>
                <p className="text-xs text-[#5C6573] mt-0.5">Your official payment receipt is generated.</p>
              </div>

              <div className="bg-[#F9F7F2] p-3.5 rounded-xl border border-[#E5E1D8] text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5C6573]">Transaction ID:</span>
                  <span className="font-mono font-bold text-[#8C6B28]">{generatedTrxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6573]">Amount Paid:</span>
                  <span className="font-serif font-bold text-[#1B4D3E]">৳{appointment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6573]">Method:</span>
                  <span className="font-bold text-[#1B2430]">{selectedMethod}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F1EDE4] border border-[#E5E1D8] text-[#1B2430] text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Print Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] text-xs font-bold cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

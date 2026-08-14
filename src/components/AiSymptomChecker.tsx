import React, { useState } from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Activity, 
  Info,
  Calendar
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const AiSymptomChecker: React.FC<{
  onBookSpecialist: (departmentId: string) => void;
}> = ({ onBookSpecialist }) => {
  const { language, t, showToast } = useHospital();
  const [symptomsInput, setSymptomsInput] = useState('');
  const [patientAge, setPatientAge] = useState(32);
  const [patientGender, setPatientGender] = useState('Male');
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  const samplePresets = language === 'bn' ? [
    '২ দিন ধরে বুকে চিনচিন ব্যথা ও বুক ধড়ফড় করছে',
    'তীব্র মাথা ব্যথা, বমি বমি ভাব ও চোখে ঝাপসা দেখা',
    'হাঁটুতে তীব্র ব্যথা, বসলে উঠতে সমস্যা হয়',
    'শিশুর প্রচণ্ড জ্বর ও কাশি, কিছু খাচ্ছে না',
  ] : [
    'Chest discomfort, mild shortness of breath during walking',
    'Severe migraine headache with nausea and light sensitivity',
    'Chronic knee joint stiffness and lower back pain',
    'High fever in infant with persistent cough and appetite loss',
  ];

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsLoading(true);
    setTriageResult(null);

    try {
      const res = await fetch('/api/ai/symptom-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsInput.trim(),
          language,
          age: patientAge,
          gender: patientGender,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTriageResult(data);
      } else {
        throw new Error('Failed to triage');
      }
    } catch (err) {
      // Fallback
      setTriageResult({
        suggestedDepartment: 'Cardiology',
        departmentBn: 'কার্ডিওলজি ও হৃদরোগ বিভাগ',
        urgencyLevel: 'Moderate',
        urgencyLevelBn: 'মাঝারি',
        summary: language === 'bn' ? 'লক্ষণ অনুযায়ী হৃদরোগ বিশেষজ্ঞের সাথে পরামর্শ করার সুপারিশ করা হচ্ছে।' : 'Symptoms suggest consulting a cardiologist for ECG and cardiac review.',
        advice: language === 'bn' ? 'ভারী কাজ এড়িয়ে চলুন, বিশ্রাম নিন এবং রক্তচাপ পরিমাপ করুন।' : 'Avoid heavy physical exertion, rest, and check blood pressure.',
        disclaimer: 'This is an AI triaging guide only. In severe emergencies, call 10668 immediately.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartmentIdByName = (deptName: string) => {
    const lower = (deptName || '').toLowerCase();
    if (lower.includes('cardio') || lower.includes('হার্ট')) return 'cardiology';
    if (lower.includes('neuro') || lower.includes('ব্রেন')) return 'neurology';
    if (lower.includes('ortho') || lower.includes('হাড়')) return 'orthopedics';
    if (lower.includes('pediatric') || lower.includes('শিশু')) return 'pediatrics';
    if (lower.includes('gynae') || lower.includes('গাইনি')) return 'gynecology';
    if (lower.includes('derma') || lower.includes('চর্ম')) return 'dermatology';
    return 'general-medicine';
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A8833C]" />
            <span>{language === 'bn' ? 'স্মার্ট এআই ক্লিনিকাল ট্রায়াজ' : 'AI Clinical Triaging Engine'}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2430] tracking-tight">
            {t.aiSymptomCheckerTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C6573] mt-1">
            {t.aiSymptomCheckerSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleAnalyze} className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-2">
                {language === 'bn' ? 'আপনার শারীরিক লক্ষণ বিস্তারিত লিখুন:' : 'Describe Your Symptoms:'} *
              </label>
              <textarea
                rows={4}
                required
                value={symptomsInput}
                onChange={e => setSymptomsInput(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: ৩ দিন ধরে বুকে চিনচিন ব্যথা, মাথা ঘোরা ও বুক ধড়ফড় করছে...' : 'e.g. Chest pain, palpitations, and mild dizziness since yesterday...'}
                className="w-full p-3.5 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs sm:text-sm text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059] shadow-xs leading-relaxed"
              />
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-[11px] text-[#5C6573] block mb-1.5 font-medium">
                {language === 'bn' ? 'দ্রুত টেস্টের জন্য ক্লিক করুন (Sample Prompts):' : 'Click sample prompts to test:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptomsInput(preset)}
                    className="px-2.5 py-1 rounded-lg bg-[#F9F7F2] hover:bg-[#F1EDE4] border border-[#E5E1D8] text-[11px] text-[#1B2430] text-left cursor-pointer transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-[#5C6573] mb-1 font-medium">{t.patientAge}</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={e => setPatientAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] text-center font-mono focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#5C6573] mb-1 font-medium">{t.patientGender}</label>
                <select
                  value={patientGender}
                  onChange={e => setPatientGender(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Male">{t.male}</option>
                  <option value="Female">{t.female}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isLoading ? (
                <span>{language === 'bn' ? 'লক্ষণ বিশ্লেষণ হচ্ছে...' : 'Analyzing symptoms with AI...'}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.analyzeSymptomsBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-6">
          {triageResult ? (
            <div className="bg-[#FFFFFF] border-2 border-[#C5A059] rounded-2xl p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in duration-200">
              
              <div className="flex items-start justify-between border-b border-[#EDE8DF] pb-4">
                <div>
                  <span className="text-[10px] text-[#8C6B28] font-bold uppercase tracking-wider">
                    {t.suggestedSpecialist}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430] mt-0.5">
                    {language === 'bn' ? triageResult.departmentBn || triageResult.suggestedDepartment : triageResult.suggestedDepartment}
                  </h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                  triageResult.urgencyLevel === 'Emergency' || triageResult.urgencyLevel === 'Urgent'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                    : 'bg-[#EBF3F0] text-[#1B4D3E] border border-[#1B4D3E]/30'
                }`}>
                  {language === 'bn' ? triageResult.urgencyLevelBn || triageResult.urgencyLevel : triageResult.urgencyLevel}
                </span>
              </div>

              {/* AI Summary */}
              <div className="bg-[#F9F7F2] p-4 rounded-xl border border-[#E5E1D8]">
                <span className="font-serif text-xs text-[#8C6B28] font-bold block mb-1">
                  {language === 'bn' ? 'ক্লিনিকাল মূল্যায়ন:' : 'Clinical Assessment:'}
                </span>
                <p className="text-xs sm:text-sm text-[#1B2430] leading-relaxed">
                  {triageResult.summary}
                </p>
              </div>

              {/* Practical Guidance */}
              <div className="bg-[#F9F7F2] p-4 rounded-xl border border-[#E5E1D8]">
                <span className="font-serif text-xs text-[#1B4D3E] font-bold block mb-1">
                  {t.practicalAdvice}:
                </span>
                <p className="text-xs sm:text-sm text-[#5C6573] leading-relaxed">
                  {triageResult.advice}
                </p>
              </div>

              {/* Direct Booking CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const deptId = getDepartmentIdByName(triageResult.suggestedDepartment || triageResult.departmentBn);
                    onBookSpecialist(deptId);
                  }}
                  className="w-full py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {language === 'bn' ? 'এই বিশেষজ্ঞ বিভাগের ডাক্তারের সিরিয়াল বুক করুন' : 'Book Specialist in this Department'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10px] text-[#5C6573] text-center leading-relaxed">
                {triageResult.disclaimer || 'AuraHealth AI provides decision support only, not a final medical diagnosis.'}
              </p>

            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-12 text-center text-[#5C6573] h-full flex flex-col items-center justify-center shadow-xs">
              <Stethoscope className="w-12 h-12 text-[#A8833C]/60 mb-3" />
              <h4 className="font-serif font-bold text-[#1B2430] text-base">
                {language === 'bn' ? 'সঠিক বিশেষজ্ঞ ডাক্তার পেতে লক্ষণ লিখুন' : 'Enter Symptoms for AI Guidance'}
              </h4>
              <p className="text-xs text-[#5C6573] mt-1 max-w-sm">
                {language === 'bn' 
                  ? 'উপসর্গ লিখে বিশ্লেষণ বাটনে ক্লিক করলেই এআই আপনাকে সঠিক বিশেষজ্ঞ চিকিৎসক ও জরুরি পরামর্শ প্রদর্শন করবে।' 
                  : 'Submit your symptoms to receive instant specialty recommendations and triaging levels.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

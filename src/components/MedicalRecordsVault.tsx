import React, { useState } from 'react';
import { 
  FileText, 
  Activity, 
  HeartPulse, 
  UploadCloud, 
  Download, 
  Printer, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Search, 
  Filter, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { MedicalRecord, VitalsRecord } from '../types';

export const MedicalRecordsVault: React.FC = () => {
  const { language, t, medicalRecords, addMedicalRecord, user, showToast } = useHospital();

  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MedicalRecord | null>(null);

  // New Record Upload form
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Cardiology');
  const [newType, setNewType] = useState<'prescription' | 'lab_report' | 'imaging' | 'discharge_summary'>('lab_report');
  const [newDoctor, setNewDoctor] = useState('Prof. Dr. Mahmudul Hasan');
  const [newSummary, setNewSummary] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);

  const filteredRecords = medicalRecords.filter(rec => {
    const matchesType = activeTypeFilter === 'all' || rec.recordType === activeTypeFilter;
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.titleBn.includes(searchQuery) ||
      rec.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const latestPrescription = medicalRecords.find(r => r.recordType === 'prescription');
  const vitals: VitalsRecord = latestPrescription?.vitals || {
    bp: '128/82 mmHg',
    pulse: '74 bpm',
    sugar: '5.6 mmol/L',
    spO2: '99%',
    weight: '68 kg',
    temp: '98.6 °F',
    bmi: '23.4 (Normal)',
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addMedicalRecord({
      patientId: user.id,
      patientName: user.name,
      recordType: newType,
      title: newTitle.trim(),
      titleBn: newTitle.trim(),
      doctorName: newDoctor,
      doctorNameBn: newDoctor,
      department: newDept,
      date: newDate,
      summary: newSummary || 'Patient self-uploaded clinical diagnostic record.',
      summaryBn: newSummary || 'রোগী কর্তৃক আপলোডকৃত মেডিকেল টেস্ট রিপোর্ট।',
    });

    setUploadModalOpen(false);
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Upload Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8833C]" />
            <span>{language === 'bn' ? 'আজীবন নিরাপদ মেডিকেল আর্কাইভ' : 'Lifetime Encrypted Medical Vault'}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B2430] tracking-tight">
            {t.medicalVaultTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#5C6573] mt-1">
            {t.medicalVaultSubtitle}
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer w-fit transition-all"
        >
          <UploadCloud className="w-4 h-4 text-[#C5A059]" />
          <span>{t.addMedicalRecord}</span>
        </button>
      </div>

      {/* Health Vitals Dashboard Monitor */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif font-bold text-[#1B2430] text-sm sm:text-base">
              {t.vitalsCardTitle}
            </h3>
          </div>
          <span className="text-[11px] text-[#1B4D3E] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E]" />
            {language === 'bn' ? 'স্বাভাবিক ও স্থিতিশীল' : 'Stable Health Indicators'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.bloodPressure}</span>
            <div className="text-base sm:text-lg font-bold text-rose-700 font-serif mt-1">{vitals.bp}</div>
            <span className="text-[9px] text-[#1B4D3E] font-semibold">Optimal</span>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.heartPulse}</span>
            <div className="text-base sm:text-lg font-bold text-[#8C6B28] font-serif mt-1">{vitals.pulse}</div>
            <span className="text-[9px] text-[#1B4D3E] font-semibold">Normal</span>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.bloodSugar}</span>
            <div className="text-base sm:text-lg font-bold text-sky-700 font-serif mt-1">{vitals.sugar}</div>
            <span className="text-[9px] text-[#1B4D3E] font-semibold">Fasting</span>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.oxygenSpO2}</span>
            <div className="text-base sm:text-lg font-bold text-[#1B4D3E] font-serif mt-1">{vitals.spO2}</div>
            <span className="text-[9px] text-[#1B4D3E] font-semibold">Safe</span>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.bodyWeight}</span>
            <div className="text-base sm:text-lg font-bold text-purple-800 font-serif mt-1">{vitals.weight}</div>
            <span className="text-[9px] text-[#5C6573]">BMI {vitals.bmi}</span>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] text-center">
            <span className="text-[10px] text-[#5C6573] block font-medium">{t.bodyTemp}</span>
            <div className="text-base sm:text-lg font-bold text-[#8C6B28] font-serif mt-1">{vitals.temp}</div>
            <span className="text-[9px] text-[#1B4D3E] font-semibold">Normal</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল রেকর্ড' : 'All Records' },
            { id: 'prescription', label: language === 'bn' ? 'প্রেসক্রিপশন' : 'Prescriptions' },
            { id: 'lab_report', label: language === 'bn' ? 'ল্যাব টেস্ট রিপোর্ট' : 'Lab Reports' },
            { id: 'imaging', label: language === 'bn' ? 'ইসিজি ও ইমেজিং' : 'ECG & Imaging' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTypeFilter(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTypeFilter === f.id
                  ? 'bg-[#1B2430] text-[#FDFCFB] shadow-xs font-bold'
                  : 'bg-[#FFFFFF] text-[#5C6573] border border-[#E5E1D8] hover:text-[#1B2430] hover:bg-[#F9F7F2]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8833C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'রেকর্ড খুঁজুন...' : 'Search records...'}
            className="w-full pl-9 pr-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059] shadow-xs"
          />
        </div>
      </div>

      {/* Records Timeline List */}
      <div className="space-y-4">
        {filteredRecords.map(rec => (
          <div
            key={rec.id}
            className="bg-[#FFFFFF] hover:bg-[#FDFCFB] border border-[#E5E1D8] hover:border-[#C5A059] rounded-2xl p-5 transition-all shadow-xs hover:shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${
                  rec.recordType === 'prescription' ? 'bg-[#F4EAD4] text-[#8C6B28]' :
                  rec.recordType === 'lab_report' ? 'bg-[#EBF3F0] text-[#1B4D3E]' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rec.recordType === 'prescription' ? 'bg-[#F4EAD4] text-[#8C6B28] border border-[#C5A059]/40' :
                      rec.recordType === 'lab_report' ? 'bg-[#EBF3F0] text-[#1B4D3E] border border-[#1B4D3E]/30' :
                      'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {rec.recordType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#5C6573]">{rec.date}</span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#1B2430]">
                    {language === 'bn' ? rec.titleBn : rec.title}
                  </h4>
                  <p className="text-xs text-[#8C6B28] font-semibold">
                    {language === 'bn' ? rec.doctorNameBn : rec.doctorName} • {rec.department}
                  </p>
                  <p className="text-xs text-[#5C6573] mt-1 max-w-2xl">
                    {language === 'bn' ? rec.summaryBn : rec.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => {
                    setSelectedRecordForDetail(rec);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#1B2430] text-xs font-semibold border border-[#E5E1D8] cursor-pointer transition-all"
                >
                  {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Full Details'}
                </button>

                <button
                  onClick={() => {
                    showToast(language === 'bn' ? 'রেকর্ড প্রিন্ট হচ্ছে...' : 'Printing verified medical record...', 'info');
                    window.print();
                  }}
                  className="p-2 rounded-xl bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#5C6573] hover:text-[#1B2430] border border-[#E5E1D8] cursor-pointer transition-all"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* If Prescribed Medicines exist, render mini medicine tags */}
            {rec.medicines && rec.medicines.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#EDE8DF]">
                <span className="text-[11px] font-semibold text-[#5C6573] block mb-1.5">
                  {language === 'bn' ? 'ওষুধের তালিকা (Rx):' : 'Prescribed Medicines (Rx):'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {rec.medicines.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F9F7F2] border border-[#E5E1D8] text-xs text-[#1B2430]">
                      <strong className="text-[#8C6B28]">{m.name}</strong> • {m.dosage} ({m.timing})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* If Lab Test Results exist, render test result chips */}
            {rec.testResults && rec.testResults.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#EDE8DF]">
                <span className="text-[11px] font-semibold text-[#5C6573] block mb-1.5">
                  {language === 'bn' ? 'ল্যাব টেস্ট প্যারামিটার ফলাফল:' : 'Diagnostic Biomarker Results:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {rec.testResults.slice(0, 4).map((tst, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#F9F7F2] border border-[#E5E1D8] text-xs">
                      <span className="text-[10px] text-[#5C6573] block truncate font-medium">{tst.name}</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <strong className="text-[#1B2430] font-serif">{tst.value} {tst.unit}</strong>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          tst.status === 'normal' ? 'text-[#1B4D3E] bg-[#EBF3F0]' : 'text-rose-700 bg-rose-50'
                        }`}>
                          {tst.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Record Detail Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-2xl shadow-xl p-6 text-[#1B2430] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#EDE8DF] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8C6B28] uppercase tracking-wider">AuraCare Verified Medical Record</span>
                <h3 className="font-serif text-xl font-bold text-[#1B2430]">{selectedRecordForDetail.title}</h3>
                <p className="text-xs text-[#5C6573]">{selectedRecordForDetail.doctorName} • {selectedRecordForDetail.date}</p>
              </div>
              <button 
                onClick={() => setSelectedRecordForDetail(null)}
                className="p-1 rounded-lg bg-[#F9F7F2] text-[#5C6573] hover:text-[#1B2430] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5C6573] leading-relaxed">{selectedRecordForDetail.summary}</p>

            {selectedRecordForDetail.medicines && (
              <div className="space-y-2">
                <h5 className="font-serif text-xs font-bold text-[#8C6B28]">Prescription Medicines:</h5>
                <div className="space-y-1.5">
                  {selectedRecordForDetail.medicines.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#E5E1D8] text-xs">
                      <div className="font-bold text-[#1B2430]">{m.name}</div>
                      <div className="text-[#5C6573] text-[11px]">Dosage: {m.dosage} | Timing: {m.timing} | Duration: {m.duration}</div>
                      {m.instructions && <div className="text-[#8C6B28] text-[10px] mt-0.5 font-medium">Note: {m.instructions}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecordForDetail.testResults && (
              <div className="space-y-2">
                <h5 className="font-serif text-xs font-bold text-[#1B4D3E]">Lab Test Parameters:</h5>
                <div className="divide-y divide-[#EDE8DF] bg-[#F9F7F2] rounded-xl border border-[#E5E1D8]">
                  {selectedRecordForDetail.testResults.map((tst, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#1B2430]">{tst.name}</span>
                        <span className="text-[10px] text-[#5C6573] ml-2">(Ref: {tst.normalRange})</span>
                      </div>
                      <span className="font-serif font-bold text-[#1B2430]">{tst.value} {tst.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE8DF]">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#1B2430] text-xs font-semibold rounded-xl border border-[#E5E1D8] cursor-pointer"
              >
                Print Slip
              </button>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="px-4 py-2 bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Medical Record Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl w-full max-w-lg shadow-xl p-6 text-[#1B2430] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE8DF] pb-3">
              <h3 className="font-serif font-bold text-base text-[#1B2430]">{t.addMedicalRecord}</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-[#5C6573] hover:text-[#1B2430] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                  {language === 'bn' ? 'রেকর্ডের নাম / শিরোনাম' : 'Record Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete Blood Count (CBC) Report"
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="imaging">ECG / X-Ray / MRI</option>
                    <option value="discharge_summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2430] mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2430] mb-1">Doctor / Lab Center</label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={e => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430]"
                />
              </div>

              {/* Simulated File Drag & Drop */}
              <div className="border-2 border-dashed border-[#E5E1D8] rounded-xl p-4 text-center bg-[#F9F7F2] hover:border-[#C5A059] cursor-pointer transition-all">
                <UploadCloud className="w-6 h-6 text-[#A8833C] mx-auto mb-1" />
                <p className="text-xs text-[#1B2430] font-semibold">Click to upload or drag and drop PDF/JPG</p>
                <p className="text-[10px] text-[#5C6573]">Max size 25MB • 256-bit Encrypted</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE8DF]">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#5C6573] hover:text-[#1B2430] text-xs font-semibold rounded-xl border border-[#E5E1D8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

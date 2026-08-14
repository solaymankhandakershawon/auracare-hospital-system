import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Video, 
  Phone, 
  AlertCircle,
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Doctor, Appointment, PrescriptionMedicine, MedicalRecord } from '../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    language, 
    t, 
    doctors, 
    appointments, 
    selectedDoctorForDashboard, 
    setSelectedDoctorForDashboard,
    updateDoctorQueue,
    createPrescription,
    startVideoCall,
    showToast
  } = useHospital();

  const [activeTabSub, setActiveTabSub] = useState<'queue' | 'prescription' | 'history'>('queue');
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<Appointment | null>(() => {
    return appointments.find(a => a.doctorId === selectedDoctorForDashboard.id) || appointments[0] || null;
  });

  // Prescription Form State
  const [rxMedicines, setRxMedicines] = useState<PrescriptionMedicine[]>([
    {
      name: 'Tab. Bisoprolol 2.5mg (Bisocor)',
      dosage: '1+0+0',
      timing: 'Morning after meal',
      duration: '1 Month',
      instructions: 'Take regularly at 8 AM',
    },
    {
      name: 'Tab. Rosuvastatin 10mg (Rovista)',
      dosage: '0+0+1',
      timing: 'At Bedtime',
      duration: '1 Month',
      instructions: 'Low fat diet',
    }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1+0+1');
  const [newMedTiming, setNewMedTiming] = useState('খাবারের পরে / After Meal');
  const [newMedDuration, setNewMedDuration] = useState('৭ দিন / 7 Days');
  const [newMedNotes, setNewMedNotes] = useState('');

  const [diagnoses, setDiagnoses] = useState('Essential Hypertension, Mild Dyslipidemia');
  const [investigations, setInvestigations] = useState('12-Lead ECG, Serum Creatinine, Fasting Lipid Profile');
  const [adviceNotes, setAdviceNotes] = useState('Daily 30 min brisk walk. Low sodium diet. Follow up in 1 month.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-15');

  const doctorAppointments = appointments.filter(a => a.doctorId === selectedDoctorForDashboard.id);
  const currentServing = selectedDoctorForDashboard.currentSerialServing;
  const currentServingPatient = doctorAppointments.find(a => a.serialNumber === currentServing);

  const handleCallNext = () => {
    const nextSerial = currentServing + 1;
    updateDoctorQueue(selectedDoctorForDashboard.id, nextSerial);
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setRxMedicines(prev => [
      ...prev,
      {
        name: newMedName.trim(),
        dosage: newMedDosage,
        timing: newMedTiming,
        duration: newMedDuration,
        instructions: newMedNotes,
      }
    ]);
    setNewMedName('');
    setNewMedNotes('');
    showToast(language === 'bn' ? 'ওষুধ প্রেসক্রিপশনে যুক্ত হয়েছে' : 'Medicine added to Rx pad', 'info');
  };

  const handleRemoveMedicine = (idx: number) => {
    setRxMedicines(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAndSendPrescription = async () => {
    if (!selectedPatientForRx) return;

    await createPrescription({
      patientId: 'usr-pat-01',
      patientName: selectedPatientForRx.patientName,
      recordType: 'prescription',
      title: `${selectedDoctorForDashboard.specialty} Prescription`,
      titleBn: `${selectedDoctorForDashboard.specialtyBn} প্রেসক্রিপশন`,
      doctorName: selectedDoctorForDashboard.name,
      doctorNameBn: selectedDoctorForDashboard.nameBn,
      department: selectedDoctorForDashboard.specialty,
      date: new Date().toISOString().split('T')[0],
      summary: diagnoses,
      summaryBn: diagnoses,
      diagnoses: diagnoses.split(',').map(s => s.trim()),
      medicines: rxMedicines,
      adviceNotes,
      followUpDate,
      vitals: {
        bp: '125/80 mmHg',
        pulse: '72 bpm',
        sugar: '5.6 mmol/L',
        spO2: '99%',
        weight: '68 kg',
        temp: '98.6 °F',
        bmi: '23.5',
      }
    });

    setActiveTabSub('queue');
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Doctor Switcher */}
      <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={selectedDoctorForDashboard.avatarUrl}
            alt={selectedDoctorForDashboard.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A059] shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4EAD4] border border-[#C5A059]/40 text-[#8C6B28] text-[11px] font-bold">
                {t.doctorDashboardTitle}
              </span>
              <span className="text-xs text-[#1B4D3E] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1B4D3E] animate-pulse"></span>
                LIVE CHAMBER
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1B2430] mt-0.5">
              {language === 'bn' ? selectedDoctorForDashboard.nameBn : selectedDoctorForDashboard.name}
            </h2>
            <p className="text-xs text-[#8C6B28] font-semibold">
              {selectedDoctorForDashboard.chamber} • {selectedDoctorForDashboard.roomNo}
            </p>
          </div>
        </div>

        {/* Doctor Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#5C6573] hidden sm:inline">
            {language === 'bn' ? 'চেম্বার পরিবর্তন:' : 'Switch Chamber:'}
          </label>
          <select
            value={selectedDoctorForDashboard.id}
            onChange={(e) => {
              const doc = doctors.find(d => d.id === e.target.value);
              if (doc) setSelectedDoctorForDashboard(doc);
            }}
            className="px-3 py-2 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl text-xs font-bold text-[#1B2430] focus:outline-none focus:border-[#C5A059] shadow-xs cursor-pointer"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {language === 'bn' ? d.nameBn : d.name} ({d.roomNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-xs">
          <span className="text-xs text-[#5C6573] font-medium flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#A8833C]" />
            {t.currentServing}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#8C6B28] font-serif">
            #{currentServing}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-xs">
          <span className="text-xs text-[#5C6573] font-medium flex items-center gap-1 mb-1">
            <Users className="w-3.5 h-3.5 text-[#1B4D3E]" />
            {language === 'bn' ? 'আজকের মোট রোগী' : 'Booked Serials'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1B4D3E] font-serif">
            {selectedDoctorForDashboard.totalSerialsToday}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-xs">
          <span className="text-xs text-[#5C6573] font-medium flex items-center gap-1 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-[#1B2430]" />
            {language === 'bn' ? 'আজকের মোট ফি' : 'Total Revenue'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1B2430] font-serif">
            ৳{selectedDoctorForDashboard.totalSerialsToday * selectedDoctorForDashboard.consultationFee}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5E1D8] shadow-xs">
          <span className="text-xs text-[#5C6573] font-medium flex items-center gap-1 mb-1">
            <Video className="w-3.5 h-3.5 text-purple-700" />
            {language === 'bn' ? 'টেলিমেডিসিন স্লট' : 'Telemedicine'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-purple-900 font-serif">
            {doctorAppointments.filter(a => a.type === 'video').length}
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Queue Controller vs Digital Rx Builder */}
      <div className="flex border-b border-[#EDE8DF] gap-2">
        <button
          onClick={() => setActiveTabSub('queue')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTabSub === 'queue'
              ? 'border-[#1B2430] text-[#1B2430] bg-[#F9F7F2]'
              : 'border-transparent text-[#5C6573] hover:text-[#1B2430]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#A8833C]" />
          <span>{language === 'bn' ? 'লাইভ কিউ ও সিরিয়াল কন্ট্রোলার' : 'Chamber Queue Controller'}</span>
        </button>

        <button
          onClick={() => setActiveTabSub('prescription')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTabSub === 'prescription'
              ? 'border-[#1B2430] text-[#1B2430] bg-[#F9F7F2]'
              : 'border-transparent text-[#5C6573] hover:text-[#1B2430]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#A8833C]" />
          <span>{language === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন প্যাড' : 'Digital Prescription Pad'}</span>
        </button>
      </div>

      {/* TAB 1: QUEUE CONTROLLER */}
      {activeTabSub === 'queue' && (
        <div className="space-y-6">
          {/* Active Patient In-Chamber Card */}
          <div className="bg-[#FFFFFF] border-2 border-[#1B4D3E]/40 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3F0] text-[#1B4D3E] border border-[#1B4D3E]/30 text-xs font-bold">
                  CHAMBER ACTIVE • SERIAL #{currentServing}
                </span>
                {currentServingPatient && (
                  <span className="text-xs text-[#5C6573]">Token: <strong className="text-[#1B2430]">{currentServingPatient.tokenCode}</strong></span>
                )}
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2430]">
                {currentServingPatient ? currentServingPatient.patientName : (language === 'bn' ? 'চেম্বারে বর্তমানে কোনো রোগী নেই' : 'No active patient in consultation')}
              </h3>

              {currentServingPatient && (
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C6573] mt-2">
                  <span>ফোন: <strong className="text-[#1B2430]">{currentServingPatient.patientPhone}</strong></span>
                  <span>বয়স: <strong className="text-[#1B2430]">{currentServingPatient.patientAge} yrs ({currentServingPatient.patientGender})</strong></span>
                  <span>সমস্যা: <strong className="text-[#8C6B28]">{currentServingPatient.notes || 'Routine checkup'}</strong></span>
                </div>
              )}
            </div>

            {/* Chamber Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCallNext}
                className="px-6 py-3 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                <span>{t.callNextPatient} (#{currentServing + 1})</span>
              </button>

              {currentServingPatient && (
                <button
                  onClick={() => {
                    setSelectedPatientForRx(currentServingPatient);
                    setActiveTabSub('prescription');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#F4EAD4] hover:bg-[#EBDDC2] border border-[#C5A059]/40 text-[#8C6B28] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.generatePrescription}</span>
                </button>
              )}

              {currentServingPatient?.type === 'video' && (
                <button
                  onClick={() => startVideoCall(currentServingPatient)}
                  className="px-5 py-3 rounded-xl bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  <Video className="w-4 h-4 text-[#C5A059]" />
                  <span>{language === 'bn' ? 'ভিডিও কল শুরু করুন' : 'Start Video Call'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Today's Patient Queue Table */}
          <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-[#F9F7F2]">
              <h4 className="font-serif font-bold text-[#1B2430] text-sm sm:text-base">
                {language === 'bn' ? 'আজকের অ্যাপয়েন্টমেন্ট ও সিরিয়াল তালিকা' : "Today's Appointment & Serial Roster"}
              </h4>
              <span className="text-xs text-[#5C6573] font-medium">{doctorAppointments.length} Booked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1B2430]">
                <thead className="bg-[#F9F7F2] text-[#5C6573] uppercase font-bold text-[10px] border-b border-[#EDE8DF]">
                  <tr>
                    <th className="px-6 py-3">Serial #</th>
                    <th className="px-6 py-3">Patient Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Est. Time</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE8DF]">
                  {doctorAppointments.map(apt => {
                    const isCurrent = apt.serialNumber === currentServing;
                    return (
                      <tr key={apt.id} className={`hover:bg-[#F9F7F2] transition-colors ${isCurrent ? 'bg-[#F4EAD4]/30' : ''}`}>
                        <td className="px-6 py-4 font-serif font-bold text-[#8C6B28] text-sm">
                          #{apt.serialNumber}
                        </td>
                        <td className="px-6 py-4 font-medium text-[#1B2430]">
                          {apt.patientName}
                          <div className="text-[11px] text-[#5C6573]">{apt.patientPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-[#EBF3F0] text-[#1B4D3E]'
                          }`}>
                            {apt.type === 'video' ? 'Video Telemedicine' : 'In-Chamber'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#5C6573]">{apt.estimatedTime}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.paymentStatus === 'paid' ? 'bg-[#EBF3F0] text-[#1B4D3E]' : 'bg-[#F4EAD4] text-[#8C6B28]'
                          }`}>
                            {apt.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.serialNumber < currentServing ? 'text-[#5C6573] bg-[#F1EDE4]' :
                            isCurrent ? 'bg-[#EBF3F0] text-[#1B4D3E] ring-1 ring-[#1B4D3E]/40' :
                            'bg-[#F9F7F2] text-[#1B2430] border border-[#E5E1D8]'
                          }`}>
                            {apt.serialNumber < currentServing ? 'Completed' : isCurrent ? 'In Session' : 'Waiting'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {apt.type === 'video' && (
                            <button
                              onClick={() => startVideoCall(apt)}
                              className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-bold cursor-pointer"
                            >
                              Call
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedPatientForRx(apt);
                              setActiveTabSub('prescription');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] text-[11px] font-bold cursor-pointer"
                          >
                            Rx
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL PRESCRIPTION BUILDER */}
      {activeTabSub === 'prescription' && (
        <div className="bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Patient Header */}
          <div className="bg-[#F9F7F2] p-4 sm:p-5 rounded-xl border border-[#E5E1D8] flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#8C6B28] font-bold uppercase tracking-wider">Patient for Prescription:</span>
              <h4 className="font-serif text-lg font-bold text-[#1B2430]">{selectedPatientForRx?.patientName || 'Md. Solayman Shawon'}</h4>
              <p className="text-xs text-[#5C6573]">Token: {selectedPatientForRx?.tokenCode || 'AUR-8412'} • Age: {selectedPatientForRx?.patientAge || 32} • Phone: {selectedPatientForRx?.patientPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#5C6573]">Date: {new Date().toISOString().split('T')[0]}</span>
              <div className="text-xs text-[#1B4D3E] font-semibold">Digital Hospital Stamp Verified ✓</div>
            </div>
          </div>

          {/* Clinical Diagnosis & Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                {language === 'bn' ? 'রোগের ডায়াগনোসিস (Diagnosis)' : 'Clinical Diagnosis'}
              </label>
              <input
                type="text"
                value={diagnoses}
                onChange={e => setDiagnoses(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                {t.investigationAdvised}
              </label>
              <input
                type="text"
                value={investigations}
                onChange={e => setInvestigations(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* Rx Medicines List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-serif font-bold text-sm sm:text-base text-[#1B2430] flex items-center gap-1.5">
                <span className="text-[#8C6B28] font-serif italic text-lg font-bold">Rx.</span>
                <span>{language === 'bn' ? 'প্রেসক্রাইবড মেডিসিন তালিকা' : 'Prescribed Medicines'}</span>
              </h5>
            </div>

            {/* Add Medicine Mini-Form */}
            <div className="p-4 sm:p-5 bg-[#F9F7F2] border border-[#E5E1D8] rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Tab. Bisoprolol 5mg)"
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 1+0+1)"
                  value={newMedDosage}
                  onChange={e => setNewMedDosage(e.target.value)}
                  className="px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 1 Month)"
                  value={newMedDuration}
                  onChange={e => setNewMedDuration(e.target.value)}
                  className="px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Timing & instructions (e.g. Morning after meal)"
                  value={newMedTiming}
                  onChange={e => setNewMedTiming(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-lg text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-4 py-2 bg-[#1B2430] hover:bg-[#2C3539] text-[#FDFCFB] font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{t.prescribeMedicine}</span>
                </button>
              </div>
            </div>

            {/* Medicines List Table */}
            <div className="divide-y divide-[#EDE8DF] bg-[#F9F7F2] rounded-xl border border-[#E5E1D8] overflow-hidden">
              {rxMedicines.map((med, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#F1EDE4] transition-colors">
                  <div>
                    <span className="font-bold text-[#1B2430] text-sm">{idx + 1}. {med.name}</span>
                    <div className="text-[#5C6573] text-[11px] mt-0.5">
                      ডোজ: <strong className="text-[#8C6B28]">{med.dosage}</strong> • সময়: {med.timing} • মেয়াদ: {med.duration}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(idx)}
                    className="p-1 text-[#5C6573] hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Follow up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                {language === 'bn' ? 'বিশেষ উপদেশ ও পরামর্শ' : 'Advice Notes'}
              </label>
              <textarea
                rows={2}
                value={adviceNotes}
                onChange={e => setAdviceNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2430] mb-1">
                {t.followUpDate}
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE8DF]">
            <button
              onClick={() => setActiveTabSub('queue')}
              className="px-4 py-2.5 rounded-xl bg-[#F9F7F2] hover:bg-[#F1EDE4] text-[#5C6573] hover:text-[#1B2430] text-xs font-semibold border border-[#E5E1D8] cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveAndSendPrescription}
              className="px-6 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#153B30] text-[#FDFCFB] font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>{t.saveAndSendPrescription}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Share2, 
  Maximize, 
  Minimize, 
  FileText, 
  ShieldCheck, 
  Send, 
  Sparkles,
  Volume2,
  Users
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const VideoConsultation: React.FC = () => {
  const { 
    language, 
    t, 
    videoCall, 
    setVideoCall, 
    endVideoCall, 
    user, 
    showToast 
  } = useHospital();

  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraError, setHasCameraError] = useState(false);

  // Request actual camera & mic if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalMediaStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.log('Using simulated camera stream:', err);
        setHasCameraError(true);
      }
    }

    if (videoCall.isActive) {
      setupCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoCall.isActive]);

  const toggleMic = () => {
    if (localMediaStream) {
      localMediaStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setVideoCall(prev => ({ ...prev, isMicMuted: !prev.isMicMuted }));
    showToast(videoCall.isMicMuted ? 'মাইক চালু করা হয়েছে' : 'মাইক মিউট করা হয়েছে', 'info');
  };

  const toggleCamera = () => {
    if (localMediaStream) {
      localMediaStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setVideoCall(prev => ({ ...prev, isCameraOff: !prev.isCameraOff }));
    showToast(videoCall.isCameraOff ? 'ক্যামেরা চালু করা হয়েছে' : 'ক্যামেরা বন্ধ করা হয়েছে', 'info');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      sender: (user.role === 'doctor' ? 'doctor' : 'patient') as 'doctor' | 'patient',
      senderName: user.name,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setVideoCall(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg],
    }));
    setChatInput('');

    // Doctor auto response simulation if patient sent message
    if (user.role === 'patient') {
      setTimeout(() => {
        setVideoCall(prev => ({
          ...prev,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: 'msg-reply-' + Date.now(),
              sender: 'doctor',
              senderName: videoCall.doctor?.name || 'Prof. Dr. Mahmudul Hasan',
              text: language === 'bn' 
                ? 'আমি আপনার সমস্যাটি নোট করেছি। প্রেসক্রিপশনে প্রয়োজনীয় ওষুধের নির্দেশনা যোগ করে দিচ্ছি।' 
                : 'I noted your symptoms. Adding the medicine plan to your digital prescription.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]
        }));
      }, 2000);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const doctorName = videoCall.doctor ? (language === 'bn' ? videoCall.doctor.nameBn : videoCall.doctor.name) : 'Prof. Dr. Mahmudul Hasan';
  const specialty = videoCall.doctor ? (language === 'bn' ? videoCall.doctor.specialtyBn : videoCall.doctor.specialty) : 'Cardiology & Heart Care';

  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Telemedicine Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E] animate-ping" />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#1B2430]">
              {t.videoConsultTitle}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3F0] border border-[#1B4D3E]/30 text-[#1B4D3E] text-xs font-bold">
              HD 1080p ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-[#5C6573] mt-0.5">
            {doctorName} • {specialty}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E5E1D8] text-xs font-serif font-bold text-[#8C6B28] flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>{formatDuration(videoCall.callDurationSeconds)}</span>
          </div>

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              chatOpen ? 'bg-[#1B2430] text-[#FDFCFB] border-[#1B2430]' : 'bg-[#FFFFFF] text-[#5C6573] border-[#E5E1D8] hover:text-[#1B2430]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden sm:inline">{t.inCallChat}</span>
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Video Canvas Container */}
        <div className={`${chatOpen ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all`}>
          <div className="relative aspect-video bg-[#1B2430] border-2 border-[#E5E1D8] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center group">
            
            {/* Primary Remote Stream (Doctor Video Feed) */}
            <div className="w-full h-full relative">
              <img
                src={videoCall.doctor?.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
                alt="Doctor Video Stream"
                className="w-full h-full object-cover filter contrast-105 brightness-95"
                referrerPolicy="no-referrer"
              />

              {/* Live Overlay watermark */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#1B2430]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-[#FDFCFB]">{doctorName}</span>
                <span className="text-[10px] text-[#C5A059] font-medium">(Specialist Chamber)</span>
              </div>

              {/* Signal & Encryption badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#1B2430]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs text-[#EDE8DF]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">256-bit TLS</span>
              </div>
            </div>

            {/* Picture-in-Picture: Patient's Own Live Camera Stream */}
            <div className="absolute bottom-20 right-4 w-36 sm:w-48 aspect-video rounded-xl bg-slate-900 border-2 border-[#C5A059] shadow-2xl overflow-hidden z-20">
              {!videoCall.isCameraOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-950">
                  <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                  <span>ক্যামেরা অফ</span>
                </div>
              )}

              <div className="absolute bottom-1 left-1.5 text-[9px] font-bold bg-slate-950/80 px-1.5 py-0.5 rounded text-[#C5A059]">
                {user.name} (You)
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1B2430]/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-2xl z-30">
              {/* Mic Toggle */}
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  videoCall.isMicMuted
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={videoCall.isMicMuted ? t.unmuteMic : t.muteMic}
              >
                {videoCall.isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  videoCall.isCameraOff
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={videoCall.isCameraOff ? t.turnOnCamera : t.turnOffCamera}
              >
                {videoCall.isCameraOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
              </button>

              {/* Screen Share simulation */}
              <button
                onClick={() => showToast(language === 'bn' ? 'স্ক্রিন শেয়ারিং সক্রিয় হয়েছে' : 'Screen share initiated', 'info')}
                className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer hidden sm:block"
                title="Share Medical Reports / Screen"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* End Call Button */}
              <button
                onClick={endVideoCall}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" />
                <span>{t.endCall}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Live In-Call Chat & Clinical Notes Drawer */}
        {chatOpen && (
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E5E1D8] rounded-2xl flex flex-col h-[480px] shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 bg-[#F9F7F2] border-b border-[#EDE8DF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#8C6B28]" />
                <span className="font-serif font-bold text-xs sm:text-sm text-[#1B2430]">{t.inCallChat}</span>
              </div>
              <span className="text-[10px] text-[#1B4D3E] font-bold">LIVE SYNCED</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
              {videoCall.chatMessages.map(msg => {
                const isMe = (user.role === 'doctor' && msg.sender === 'doctor') || (user.role === 'patient' && msg.sender === 'patient');
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-[#5C6573] mb-0.5">{msg.senderName} • {msg.time}</span>
                    <div className={`px-3.5 py-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                      isMe 
                        ? 'bg-[#1B2430] text-[#FDFCFB] font-medium rounded-tr-none' 
                        : 'bg-[#F9F7F2] text-[#1B2430] rounded-tl-none border border-[#E5E1D8]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#F9F7F2] border-t border-[#EDE8DF] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t.typeMessage}
                className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E5E1D8] rounded-xl text-xs text-[#1B2430] placeholder-[#5C6573]/60 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#1B2430] text-[#FDFCFB] hover:bg-[#2C3539] transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

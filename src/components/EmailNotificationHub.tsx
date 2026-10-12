import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Clock, 
  Calendar, 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Laptop
} from 'lucide-react';
import { useDental } from '../context/DentalContext.tsx';
import { EmailNotification } from '../types.ts';

export const EmailNotificationHub: React.FC = () => {
  const { 
    emailNotifications, 
    previewEmail, 
    setPreviewEmail, 
    appointments, 
    trigger24hReminder, 
    triggerPostCareEmail 
  } = useDental();

  const [activeTabFilter, setActiveTabFilter] = useState<string>('all');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Currently viewed email (default to previewEmail or latest email)
  const currentEmail = previewEmail || emailNotifications[0];

  const filteredEmails = activeTabFilter === 'all'
    ? emailNotifications
    : emailNotifications.filter((e) => e.type === activeTabFilter);

  const activeApt = appointments.find((a) => a.status === 'confirmed');

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Automated Transactional Email System
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Dispatch Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Email Notifications Center
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect all real-time patient notifications generated during appointment booking, 24-hour visit reminders, and post-procedure clinical care plans.
            </p>
          </div>

          {/* Quick Simulation Triggers */}
          <div className="flex flex-wrap items-center gap-2.5">
            {activeApt && (
              <>
                <button
                  onClick={() => trigger24hReminder(activeApt.id)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send 24h Reminder</span>
                </button>
                <button
                  onClick={() => triggerPostCareEmail(activeApt.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#CEF04C]" />
                  <span>Send Post-Care Guide</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Two-Column Explorer: Email Inbox on Left (4 cols), Rendered Preview on Right (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Email Outbox List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Dispatched Logs ({emailNotifications.length})</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Auto-saved in real-time
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'booking_confirmation', label: 'Booking' },
                { id: 'reminder_24h', label: '24h Reminder' },
                { id: 'post_care_followup', label: 'Aftercare' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTabFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Email Cards List */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredEmails.map((email) => {
                const isSelected = currentEmail?.id === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => setPreviewEmail(email)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {email.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{email.sentAt}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {email.subject}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {email.previewSnippet}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 font-medium truncate">To: {email.patientEmail}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3 h-3" />
                        <span>Delivered</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Preview Device Frame (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Preview Toolbar */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Preview Device:</span>
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                  <button
                    onClick={() => setDevicePreview('desktop')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      devicePreview === 'desktop' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setDevicePreview('mobile')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      devicePreview === 'mobile' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SPF / DKIM Authenticated</span>
                </span>
              </div>
            </div>

            {/* Email Metadata Header */}
            {currentEmail && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1.5 text-slate-600">
                <div className="flex">
                  <span className="w-16 font-bold text-slate-400">Subject:</span>
                  <span className="font-bold text-slate-900">{currentEmail.subject}</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-bold text-slate-400">From:</span>
                  <span>Oraluxe Clinic Concierge &lt;notifications@oraluxe.clinic&gt;</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-bold text-slate-400">To:</span>
                  <span className="font-semibold text-blue-700">{currentEmail.patientEmail}</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-bold text-slate-400">Date:</span>
                  <span>{currentEmail.sentAt} &bull; Delivery Status: 250 OK (SMTP Handshake)</span>
                </div>
              </div>
            )}

            {/* Rendered Email Body in device container */}
            <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl flex items-center justify-center min-h-[480px]">
              <div 
                className={`w-full transition-all duration-300 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden ${
                  devicePreview === 'mobile' ? 'max-w-[390px]' : 'max-w-2xl'
                }`}
              >
                {currentEmail ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: currentEmail.bodyHtml }}
                    className="p-1"
                  />
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No email selected
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

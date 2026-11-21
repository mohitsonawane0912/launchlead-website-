import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';

export const ContactPage: React.FC = () => {
  const { eyebrow, heading, subtitle, location, unconfiguredChannelsNotice, email, phone } = siteConfig.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    _hp: '', // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Your Name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Your Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Your Message is required.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', _hp: '' });
        setErrors({});
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to submit enquiry. Please try again.');
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network or server error. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex flex-col">
      {/* Dark Navy Hero */}
      <section className="relative overflow-hidden hero-radial-bg py-16 sm:py-24 border-b border-slate-800/60 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block mb-3">
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-blue-400 bg-blue-950/60 border border-blue-800/50 rounded-full px-3.5 py-1"
              style={{ letterSpacing: '0.22em' }}
            >
              {eyebrow}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
            {heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Content on Light Lavender-Gray Background */}
      <section className="bg-[#f3f5fa] py-16 sm:py-24 text-slate-900 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Get in Touch Info Area */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100 space-y-6">
              <h2 className="text-2xl font-bold text-[#0a1128] font-['Plus_Jakarta_Sans',sans-serif]">
                Get in Touch
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Reach out to us with any questions regarding learning programs, mentorship, or startup initiatives at AEDVIX.
              </p>

              <div className="space-y-5 pt-2 border-t border-slate-100">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Location</h3>
                    <p className="text-sm text-slate-600">{location}</p>
                  </div>
                </div>

                {/* Configurable Email */}
                {email ? (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Email</h3>
                      <a href={`mailto:${email}`} className="text-sm text-blue-600 hover:underline">
                        {email}
                      </a>
                    </div>
                  </div>
                ) : null}

                {/* Configurable Phone */}
                {phone ? (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Phone</h3>
                      <a href={`tel:${phone}`} className="text-sm text-blue-600 hover:underline">
                        {phone}
                      </a>
                    </div>
                  </div>
                ) : null}

                {/* Notice for unconfigured channels as specified in reference */}
                {!email && !phone && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                    {unconfiguredChannelsNotice}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Send an Enquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100">
              <h2 className="text-2xl font-bold text-[#0a1128] mb-6 font-['Plus_Jakarta_Sans',sans-serif]">
                Send an Enquiry
              </h2>

              {status === 'success' ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2.5 font-bold text-lg text-emerald-800">
                    <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Enquiry Sent Successfully!</span>
                  </div>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Thank you for contacting AEDVIX. Your enquiry has been securely received and recorded.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-3 px-5 py-2 text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field hidden from real users */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact_hp">Leave empty</label>
                    <input
                      id="contact_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData._hp}
                      onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Your Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.name
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your name"
                      aria-required="true"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>}
                  </div>

                  {/* Your Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="name@example.com"
                      aria-required="true"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                  </div>

                  {/* Your Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y ${
                        errors.message
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="How can we help?"
                      aria-required="true"
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-600 font-medium">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Enquiry</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

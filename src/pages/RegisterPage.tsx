import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { eyebrow, heading, subtitle, sidePanel, formHeading, disclaimerNote, guardianConsentText, privacyConsentText } = siteConfig.register;
  const { plans } = siteConfig.programs;

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    grade: '',
    city: '',
    state: '',
    email: '',
    mobile: '',
    plan: '',
    startupIdea: '',
    guardianConsent: false,
    privacyConsent: false,
    _hp: '', // Honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Preselect plan from URL query param if present
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && plans.some((p) => p.id === planParam.toLowerCase())) {
      setFormData((prev) => ({ ...prev, plan: planParam.toLowerCase() }));
    } else if (!formData.plan && plans.length > 0) {
      setFormData((prev) => ({ ...prev, plan: plans[0].id }));
    }
  }, [searchParams, plans]);

  const parsedAge = parseInt(formData.age, 10);
  const isUnder18 = !isNaN(parsedAge) && parsedAge < 18;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Student Full Name is required.';
    }

    if (!formData.age.trim()) {
      errs.age = 'Age is required.';
    } else if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 99) {
      errs.age = 'Please enter a valid age (5 - 99).';
    }

    if (!formData.grade.trim()) {
      errs.grade = 'Class / Grade is required (e.g. Grade 10).';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      errs.state = 'State is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      errs.mobile = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.plan) {
      errs.plan = 'Please select a program plan.';
    }

    if (isUnder18 && !formData.guardianConsent) {
      errs.guardianConsent = 'Parent or guardian consent is required for students under 18.';
    }

    if (!formData.privacyConsent) {
      errs.privacyConsent = 'You must agree to the privacy notice to submit.';
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setErrors({});
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to submit registration. Please try again.');
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
      <section className="relative overflow-hidden hero-radial-bg py-16 sm:py-20 border-b border-slate-800/60 text-center">
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

      {/* Main Two-Column Layout on Light Lavender-Gray Background */}
      <section className="bg-[#f3f5fa] py-16 sm:py-24 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Side Panel: Branding, Growth Graphic, Inspiring Copy */}
            <div className="lg:col-span-5 bg-[#0a0f1d] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              {/* Subtle ambient lighting */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-3 block">
                  {sidePanel.tagline}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 font-['Plus_Jakarta_Sans',sans-serif]">
                  {sidePanel.title}
                </h2>
                <p className="text-slate-300 text-base leading-relaxed mb-8">
                  {sidePanel.description}
                </p>

                {/* Abstract Educational Growth Graphic Featuring Official Emblem */}
                <div className="py-6 flex justify-center" aria-hidden="true">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Concentric growth orbits */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
                      <circle cx="100" cy="100" r="90" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1.5" strokeDasharray="4 6" />
                      <circle cx="100" cy="100" r="68" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="46" stroke="rgba(99, 102, 241, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Orbital accent nodes */}
                      <circle cx="100" cy="10" r="4" fill="#a855f7" />
                      <circle cx="170" cy="100" r="3.5" fill="#38bdf8" />
                      <circle cx="30" cy="100" r="3.5" fill="#38bdf8" />
                    </svg>

                    {/* Official Emblem centered */}
                    <div className="relative z-10 w-28 h-28 flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-lg">
                      <img
                        src="/aedvix-emblem-dark.png"
                        alt="AEDVIX Emblem"
                        className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(168,85,247,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Informational reassurance block */}
              <div className="relative z-10 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                <p>✓ Transparent expressions of interest</p>
                <p>✓ No online payment required during registration</p>
                <p>✓ All student data handled confidentially</p>
              </div>
            </div>

            {/* Right Side Panel: Registration Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.06)] border border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1128] mb-2 font-['Plus_Jakarta_Sans',sans-serif]">
                {formHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100 leading-relaxed">
                {disclaimerNote}
              </p>

              {status === 'success' ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-3 font-bold text-xl text-emerald-800">
                    <svg className="w-7 h-7 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Registration Interest Recorded!</span>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    Thank you for expressing your interest in joining AEDVIX. Your details have been securely recorded.
                  </p>
                  <p className="text-xs text-emerald-700">
                    Note: This registration is an expression of interest and does not require payment or guarantee a confirmed seat until verified by the AEDVIX team.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setFormData({
                          fullName: '',
                          age: '',
                          grade: '',
                          city: '',
                          state: '',
                          email: '',
                          mobile: '',
                          plan: plans[0]?.id || 'basic',
                          startupIdea: '',
                          guardianConsent: false,
                          privacyConsent: false,
                          _hp: '',
                        });
                      }}
                      className="px-6 py-2.5 text-sm font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      Register Another Student
                    </button>
                    <Link
                      to="/"
                      className="px-6 py-2.5 text-sm font-semibold rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      Return Home
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="reg_hp">Leave empty</label>
                    <input
                      id="reg_hp"
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

                  {/* 1. Student Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-1">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="e.g. Rahul Sharma"
                      aria-required="true"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>

                  {/* Row: Age & Class/Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 2. Age */}
                    <div>
                      <label htmlFor="age" className="block text-sm font-semibold text-slate-800 mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="age"
                        type="number"
                        min="5"
                        max="99"
                        value={formData.age}
                        onChange={(e) => {
                          setFormData({ ...formData, age: e.target.value });
                          if (errors.age) setErrors({ ...errors, age: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.age
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="e.g. 16"
                        aria-required="true"
                      />
                      {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
                    </div>

                    {/* 3. Class / Grade */}
                    <div>
                      <label htmlFor="grade" className="block text-sm font-semibold text-slate-800 mb-1">
                        Class / Grade <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="grade"
                        type="text"
                        value={formData.grade}
                        onChange={(e) => {
                          setFormData({ ...formData, grade: e.target.value });
                          if (errors.grade) setErrors({ ...errors, grade: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.grade
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="e.g. Grade 10"
                        aria-required="true"
                      />
                      {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
                    </div>
                  </div>

                  {/* Row: City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 4. City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-slate-800 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.city
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="e.g. Shirpur"
                        aria-required="true"
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                    </div>

                    {/* 5. State */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-slate-800 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => {
                          setFormData({ ...formData, state: e.target.value });
                          if (errors.state) setErrors({ ...errors, state: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.state
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="e.g. Maharashtra"
                        aria-required="true"
                      />
                      {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                    </div>
                  </div>

                  {/* Row: Email Address & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 6. Email Address */}
                    <div>
                      <label htmlFor="regEmail" className="block text-sm font-semibold text-slate-800 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="regEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="student@example.com"
                        aria-required="true"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    {/* 7. Mobile Number */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-semibold text-slate-800 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => {
                          setFormData({ ...formData, mobile: e.target.value });
                          if (errors.mobile) setErrors({ ...errors, mobile: '' });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          errors.mobile
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="10-digit Indian mobile number"
                        aria-required="true"
                      />
                      {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                    </div>
                  </div>

                  {/* 8. Select Plan */}
                  <div>
                    <label htmlFor="plan" className="block text-sm font-semibold text-slate-800 mb-1">
                      Select Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="plan"
                      value={formData.plan}
                      onChange={(e) => {
                        setFormData({ ...formData, plan: e.target.value });
                        if (errors.plan) setErrors({ ...errors, plan: '' });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.plan
                          ? 'border-red-400 focus:ring-red-400'
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      aria-required="true"
                    >
                      <option value="">Select a plan</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.priceAndTerm})
                        </option>
                      ))}
                    </select>
                    {errors.plan && <p className="mt-1 text-xs text-red-600">{errors.plan}</p>}
                  </div>

                  {/* 9. Startup Idea or Interest (optional) */}
                  <div>
                    <label htmlFor="startupIdea" className="block text-sm font-semibold text-slate-800 mb-1">
                      Startup Idea or Interest <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="startupIdea"
                      rows={3}
                      value={formData.startupIdea}
                      onChange={(e) => setFormData({ ...formData, startupIdea: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
                      placeholder="What would you like to learn or build?"
                    />
                  </div>

                  {/* 10. Parent/Guardian Consent Checkbox (required when under 18) */}
                  {isUnder18 && (
                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.guardianConsent}
                          onChange={(e) => {
                            setFormData({ ...formData, guardianConsent: e.target.checked });
                            if (errors.guardianConsent) setErrors({ ...errors, guardianConsent: '' });
                          }}
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-700 leading-snug">
                          {guardianConsentText} <span className="text-red-500 font-bold">*</span>
                        </span>
                      </label>
                      {errors.guardianConsent && (
                        <p className="mt-1 text-xs text-red-600 font-medium ml-7">{errors.guardianConsent}</p>
                      )}
                    </div>
                  )}

                  {/* 11. Privacy Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) => {
                          setFormData({ ...formData, privacyConsent: e.target.checked });
                          if (errors.privacyConsent) setErrors({ ...errors, privacyConsent: '' });
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs text-slate-700 leading-snug">
                        {privacyConsentText}{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-blue-600 underline font-medium hover:text-blue-800"
                        >
                          Privacy Notice
                        </button>
                        <span className="text-red-500 font-bold"> *</span>
                      </span>
                    </label>
                    {errors.privacyConsent && (
                      <p className="mt-1 text-xs text-red-600 font-medium ml-7">{errors.privacyConsent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Recording Interest...</span>
                      </>
                    ) : (
                      <span>Submit Registration</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Notice Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
            <h3 className="text-xl font-bold text-[#0a1128] mb-3 font-['Plus_Jakarta_Sans',sans-serif]">
              AEDVIX Registration Privacy Notice
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
              <p>
                <strong>Data Collection & Purpose:</strong> The information provided in this student registration form is collected exclusively to record your expression of interest in AEDVIX educational programs, live sessions, and mentorship.
              </p>
              <p>
                <strong>Secure Storage:</strong> Submissions are stored securely within the AEDVIX server storage environment. Records are not published publicly and are restricted strictly to authorized AEDVIX coordinators.
              </p>
              <p>
                <strong>Expressions of Interest:</strong> Submitting this registration does not initiate payment transactions or guarantee confirmed enrollment until your application is reviewed and contacted by the AEDVIX team.
              </p>
              <p>
                <strong>Under-18 Students:</strong> For students under the age of 18, confirmation of parent or guardian consent is mandatory prior to program participation.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

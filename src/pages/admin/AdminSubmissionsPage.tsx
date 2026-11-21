import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { StoredRegistration, StoredEnquiry } from '../../server/storage';
import { BrandLogo } from '../../components/BrandLogo';

export const AdminSubmissionsPage: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'registrations' | 'enquiries'>('registrations');
  const [registrations, setRegistrations] = useState<StoredRegistration[]>([]);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Selected student record for full detail inspection
  const [selectedRecord, setSelectedRecord] = useState<StoredRegistration | null>(null);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setActionError(null);
    try {
      // Fetch registrations via authenticated session cookie
      const regRes = await fetch('/api/admin/submissions', { credentials: 'include' });
      if (!regRes.ok) {
        if (regRes.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to load registrations from local SQLite database.');
      }
      const regData = await regRes.json();
      setRegistrations(regData.registrations || []);

      // Fetch enquiries via authenticated session cookie
      const enqRes = await fetch('/api/admin/enquiries', { credentials: 'include' });
      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      }
    } catch (err: any) {
      setActionError(err?.message || 'Error loading records.');
    } finally {
      setLoadingData(false);
    }
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060a14] text-slate-300">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Checking administrator session...</span>
        </div>
      </div>
    );
  }

  // Enforce unauthorized state: visitors cannot see the inbox
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleUpdateRegStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    setUpdatingId(id);
    setActionError(null);
    try {
      const res = await fetch('/api/admin/registrations/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Status update failed.');
      }

      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update registration status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateEnqStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Closed') => {
    setUpdatingId(id);
    setActionError(null);
    try {
      const res = await fetch('/api/admin/enquiries/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Status update failed.');
      }

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update enquiry status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.mobile.includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: 'New' | 'Contacted' | 'Closed') => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Contacted':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Closed':
        return 'bg-slate-700/50 text-slate-400 border border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <div className="border-b border-slate-800 bg-[#0d1527]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Local Prototype Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Database: <strong className="text-slate-200">SQLite (data/aedvix.db)</strong>
            </span>
            <button
              onClick={() => logout()}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Submissions Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Workspace Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Student Registration Submissions
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Local SQLite database submissions review. Click any student row to view complete details.
            </p>
          </div>

          <button
            onClick={() => fetchData()}
            disabled={loadingData}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh SQLite Data</span>
          </button>
        </div>

        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Tabs: Student Registrations & Contact Enquiries */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 mb-6 pb-2">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'registrations'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>Student Registrations</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white font-bold">
              {registrations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2.5 ${
              activeTab === 'enquiries'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>Contact Enquiries</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/20 text-white font-bold">
              {enquiries.length}
            </span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#0d1527] border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <svg
              className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'registrations' ? 'by student name, email, city...' : 'by name, email, message...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            {(['All', 'New', 'Contacted', 'Closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        {loadingData ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
            <p className="text-sm">Fetching registrations from SQLite database...</p>
          </div>
        ) : activeTab === 'registrations' ? (
          filteredRegistrations.length === 0 ? (
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-300">No student registrations found</p>
              <p className="text-xs text-slate-500 mt-1">
                {registrations.length === 0
                  ? 'No registrations have been saved to local SQLite yet.'
                  : 'No registrations match the selected filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#0d1527] border border-slate-800 rounded-2xl shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/50">
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Student Name</th>
                    <th className="py-3.5 px-4 font-semibold">Age</th>
                    <th className="py-3.5 px-4 font-semibold">Grade</th>
                    <th className="py-3.5 px-4 font-semibold">Plan</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredRegistrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedRecord(reg)}
                    >
                      <td className="py-4 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(reg.created_at).toLocaleDateString()} {new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {reg.full_name}
                      </td>
                      <td className="py-4 px-4">{reg.age}</td>
                      <td className="py-4 px-4">{reg.grade}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800/60">
                          {reg.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={reg.status}
                          disabled={updatingId === reg.id}
                          onChange={(e) =>
                            handleUpdateRegStatus(
                              reg.id,
                              e.target.value as 'New' | 'Contacted' | 'Closed'
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${getStatusBadge(reg.status)}`}
                        >
                          <option value="New" className="bg-slate-900 text-white">New</option>
                          <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                          <option value="Closed" className="bg-slate-900 text-white">Closed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(reg);
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Enquiries Tab */
          filteredEnquiries.length === 0 ? (
            <div className="bg-[#0d1527] border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-300">No contact enquiries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-[#0d1527] border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-base font-bold text-white">{enq.name}</h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(enq.status)}`}>
                          {enq.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(enq.created_at).toLocaleDateString()} {new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500">Email: </span>
                        <a href={`mailto:${enq.email}`} className="text-blue-400 font-medium hover:underline">
                          {enq.email}
                        </a>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                        <p>{enq.message}</p>
                      </div>
                    </div>

                    <div>
                      <select
                        value={enq.status}
                        disabled={updatingId === enq.id}
                        onChange={(e) =>
                          handleUpdateEnqStatus(
                            enq.id,
                            e.target.value as 'New' | 'Contacted' | 'Closed'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="New">Mark New</option>
                        <option value="Contacted">Mark Contacted</option>
                        <option value="Closed">Mark Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Record Full Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-400 font-bold block mb-1">
                  Registration Record Details
                </span>
                <h2 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  {selectedRecord.full_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close details"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Plan Chosen</span>
                <span className="text-sm font-bold text-white uppercase">{selectedRecord.plan} Plan</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Review Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Age & Class/Grade</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedRecord.age} years old · {selectedRecord.grade}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Location</span>
                <span className="text-sm font-semibold text-slate-200">
                  {selectedRecord.city}, {selectedRecord.state}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Email Address</span>
                <a href={`mailto:${selectedRecord.email}`} className="text-sm font-semibold text-blue-400 hover:underline">
                  {selectedRecord.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Mobile Number</span>
                <a href={`tel:${selectedRecord.mobile}`} className="text-sm font-semibold text-slate-200 hover:underline">
                  +91 {selectedRecord.mobile}
                </a>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Startup Idea or Interest</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedRecord.startup_idea || 'None provided.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Parent / Guardian Consent</span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedRecord.guardian_consent ? '✓ Confirmed (Student under 18)' : 'N/A (Student is 18+)'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block mb-1">Privacy Consent</span>
                <span className="text-xs font-semibold text-slate-200">
                  {selectedRecord.privacy_consent ? '✓ Agreed to Privacy Notice' : 'No'}
                </span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-400">
                <span>Record ID: {selectedRecord.id}</span>
                <span className="block mt-1">
                  Submitted At: {new Date(selectedRecord.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Status Change Inside Modal */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Set Status:</span>
                {(['New', 'Contacted', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateRegStatus(selectedRecord.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedRecord.status === st
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

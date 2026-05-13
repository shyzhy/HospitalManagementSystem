import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { path: '/patients', id: 'patients', label: 'Patients', icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
  { path: '/doctors', id: 'doctors', label: 'Doctors', icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { path: '/consultations', id: 'consultations', label: 'Consultations', icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { path: '/prescriptions', id: 'prescriptions', label: 'Prescriptions', icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { path: '/treatment', id: 'treatment', label: 'Treatment', icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { path: '/medical-records', id: 'medical_records', label: 'Medical Records', icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { path: '/account', id: 'account', label: 'Account', icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const userRole = localStorage.getItem('role') || 'patient';

  const filteredTabs = tabs.filter(tab => {
    if (userRole === 'admin') return tab.id !== 'account';
    if (userRole === 'doctor') return tab.id !== 'doctors';
    if (userRole === 'patient') return ['consultations', 'prescriptions', 'account'].includes(tab.id);
    return false;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-14 lg:top-0 left-0 h-[calc(100vh-3.5rem)] lg:h-auto w-[260px] bg-[#2b3240] text-[#9ba5b7] flex flex-col shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.05)] z-40 lg:z-20 py-4 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 mb-4 mt-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#6c7a93]">Main Navigation</span>
        </div>
        <nav className="flex flex-col space-y-1">
          {filteredTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3.5 text-sm font-semibold tracking-wide transition-all ${isActive ? 'bg-[#556ee6] text-white border-l-4 border-white' : 'hover:bg-[#323947] hover:text-[#d3d9e3] border-l-4 border-transparent'}`
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="capitalize">{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

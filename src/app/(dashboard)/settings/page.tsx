'use client';

import React, { useState } from 'react';
import { User, Buildings, Bell, Key, ShieldCheck } from '@phosphor-icons/react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { name: 'Profile', icon: <User weight="bold" /> },
    { name: 'Organization', icon: <Buildings weight="bold" /> },
    { name: 'Notifications', icon: <Bell weight="bold" /> },
    { name: 'API Keys', icon: <Key weight="bold" /> },
    { name: 'Security', icon: <ShieldCheck weight="bold" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-charcoal">Settings</h1>
        <p className="text-charcoal/70 mt-1">Manage your account and platform preferences</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-charcoal/10 flex overflow-hidden min-h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-ghost border-r border-charcoal/10 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.name 
                ? 'bg-white text-crimson shadow-sm border border-charcoal/5' 
                : 'text-charcoal/70 hover:bg-white/50 hover:text-charcoal'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {activeTab === 'Profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-charcoal/10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-charcoal to-charcoal/70 flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-lg text-charcoal mb-2">Profile Picture</h3>
                  <button className="px-4 py-2 bg-white border border-charcoal/20 rounded-lg text-sm font-medium text-charcoal hover:bg-ghost transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Full Name</label>
                  <input type="text" defaultValue="Jane Doe" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Email Address</label>
                  <input type="email" defaultValue="jane.doe@example.com" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Role</label>
                  <input type="text" defaultValue="Senior Legal Counsel" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson bg-ghost" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Department</label>
                  <input type="text" defaultValue="Legal & Compliance" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson" />
                </div>
              </div>

              <div className="pt-6">
                <button className="px-6 py-2 bg-crimson text-white rounded-lg font-medium hover:bg-crimson/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Organization' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-charcoal mb-6 pb-4 border-b border-charcoal/10">Organization Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Organization Name</label>
                  <input type="text" defaultValue="Acme Corporation" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/70">Industry</label>
                  <input type="text" defaultValue="Financial Services" className="w-full px-4 py-2 rounded-lg border border-charcoal/20 outline-none focus:border-crimson" />
                </div>
                
                <div className="pt-6">
                  <label className="text-sm font-bold text-charcoal/70 block mb-4">Compliance Frameworks</label>
                  <div className="space-y-3">
                    {['SOC 2 Type II', 'GDPR', 'HIPAA', 'ISO 27001'].map(framework => (
                      <label key={framework} className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-crimson focus:ring-crimson border-charcoal/20" />
                        <span className="text-sm font-medium text-charcoal">{framework}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {['Notifications', 'API Keys', 'Security'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-charcoal/40 space-y-4">
              <ShieldCheck size={48} weight="thin" />
              <p>Configuration options for {activeTab} will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

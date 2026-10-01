import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Building2, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandNavy">
          Club Settings & Configuration
        </h1>
        <p className="text-sm text-mutedText mt-0.5">
          Manage gym location, contact info, GST credentials, and staff access.
        </p>
      </div>

      <div className="bg-white p-6 rounded-md border border-cardBorder shadow-card max-w-3xl">
        <h3 className="text-base font-bold text-brandNavy mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-actionBlue" />
          Gym Profile Information
        </h3>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">Gym Name</label>
              <input
                type="text"
                defaultValue="GYMOS Fitness (Velachery Branch)"
                className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">GSTIN Number</label>
              <input
                type="text"
                defaultValue="33AAACG0123M1ZT"
                className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">Contact Phone</label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
                className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brandNavy mb-1">Official Email</label>
              <input
                type="email"
                defaultValue="support@gymosfitness.in"
                className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brandNavy mb-1">Physical Address</label>
            <input
              type="text"
              defaultValue="No. 45, 100 Feet Bypass Road, Velachery, Chennai, Tamil Nadu - 600042"
              className="w-full px-3 py-2 bg-canvas border border-cardBorder rounded-sm text-sm text-brandNavy"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />} type="submit">
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

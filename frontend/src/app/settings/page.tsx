'use client';

import { useState, useEffect } from 'react';
import { Camera, Save, User, Building2, MapPin } from 'lucide-react';

export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCity: '',
    userInitials: '',
    schoolPic: '',
    profilePic: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFormData({
      schoolName: localStorage.getItem('vedaai_school_name') || 'Delhi Public School',
      schoolCity: localStorage.getItem('vedaai_school_city') || 'Bokaro Steel City',
      userInitials: localStorage.getItem('vedaai_user_initials') || 'N',
      schoolPic: localStorage.getItem('vedaai_school_pic') || '',
      profilePic: localStorage.getItem('vedaai_profile_pic') || ''
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('vedaai_school_name', formData.schoolName);
    localStorage.setItem('vedaai_school_city', formData.schoolCity);
    localStorage.setItem('vedaai_user_initials', formData.userInitials);
    localStorage.setItem('vedaai_school_pic', formData.schoolPic);
    localStorage.setItem('vedaai_profile_pic', formData.profilePic);
    
    // Dispatch event so Sidebar updates instantly
    window.dispatchEvent(new Event('settings-updated'));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isClient) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your school profile and user preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          
          {/* Section: Profile Pictures */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#E8612D]" />
              Profile Pictures
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* School Logo */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">School Logo URL</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={formData.schoolPic || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=FF9800"}
                      alt="School"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    name="schoolPic"
                    value={formData.schoolPic}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E8612D] focus:ring-1 focus:ring-[#E8612D] outline-none transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400">Paste an image URL to replace the default generated shape.</p>
              </div>

              {/* User Avatar */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Your Avatar URL</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#242424] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {formData.profilePic ? (
                      <img src={formData.profilePic} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold tracking-wide">{formData.userInitials || 'N'}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="profilePic"
                    value={formData.profilePic}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.png"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#E8612D] focus:ring-1 focus:ring-[#E8612D] outline-none transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400">Leave blank to use your initials.</p>
              </div>
            </div>
          </div>

          {/* Section: Profile Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#E8612D]" />
              School Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">School Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:border-[#E8612D] focus:ring-1 focus:ring-[#E8612D] outline-none transition-colors font-medium text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">City / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="schoolCity"
                    value={formData.schoolCity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:border-[#E8612D] focus:ring-1 focus:ring-[#E8612D] outline-none transition-colors font-medium text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">User Initials</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="userInitials"
                    value={formData.userInitials}
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm focus:border-[#E8612D] focus:ring-1 focus:ring-[#E8612D] outline-none transition-colors font-medium text-[#1A1A1A]"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50/80 p-6 border-t border-gray-100 flex items-center justify-end">
          <div className="flex items-center gap-4">
            {saved && (
              <span className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-right-4">
                Settings saved successfully!
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

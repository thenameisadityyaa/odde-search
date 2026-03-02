import { useState, useEffect } from "react";
import { Sun, Moon, User, Search, Palette, Database, Shield, Globe, Trash2, RefreshCcw, LogOut, Camera, ShieldCheck, Settings as SettingsIcon, Users, BarChart3, Activity } from "lucide-react";
import SearchFilters from "../components/SearchFilters";
import { getPrefs, savePrefs } from "../utils/preferences";
import { clearCache, clearRecent, clearSaved, resetAll } from "../utils/reset";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import supabase from "../lib/supabase";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, loading, isAdmin, tableMissing } = useUser();
  const [prefs, setPrefs] = useState(() => getPrefs(user?.id));
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  const updatePrefs = (patch) => {
    setPrefs((prev) => {
      const updated = { ...prev, ...patch };
      savePrefs(updated, user?.id);
      return updated;
    });
  };

  const notify = (msg) => alert(msg);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "search", label: "Search", icon: <Search size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "data", label: "Data & Privacy", icon: <Database size={18} /> },
    ...(isAdmin ? [{ id: "admin", label: "Admin Console", icon: <ShieldCheck size={18} /> }] : []),
  ];

  const avatarColors = ["blue", "indigo", "purple", "rose", "amber", "emerald"];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("❌ Image size too large. Please choose an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setSaving(true);
      try {
        await updateProfile({ avatar_url: reader.result });
      } catch (err) {
        alert("❌ Failed to upload image.");
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 animate-reveal">
      {tableMissing && (
        <div className="mb-8 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center gap-6 animate-reveal">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Shield size={24} className="text-amber-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-main mb-1">Supabase Setup Required</h3>
            <p className="text-sm text-muted leading-relaxed">
              The <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-400">profiles</code> table was not found in your database.
              Please run the <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-400">supabase_setup.sql</code> script in your Supabase SQL Editor to enable professional profiles and roles.
            </p>
          </div>
          <a
            href="https://supabase.com/dashboard/project/_/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-amber-500 text-white text-sm font-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all active:scale-95"
          >
            Open SQL Editor
          </a>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="glass rounded-3xl p-4 border border-white/10 sticky top-[var(--nav-height)]">
            <div className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "text-muted hover:bg-white/5 hover:text-main"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:block h-px bg-white/5 my-4 mx-2" />

            <button
              onClick={async () => { await signOut(); window.location.href = "/login"; }}
              className="hidden lg:flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-reveal">
              <section className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-main">User Profile</h2>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}`}>
                    {profile?.role || "User"}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="relative group">
                    <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-${profile?.avatar_color || "blue"}-500 to-${profile?.avatar_color || "blue"}-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-${profile?.avatar_color || "blue"}-500/20 overflow-hidden`}>
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()
                      )}
                      {saving && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-main text-bg-color shadow-xl border border-white/10 cursor-pointer hover:scale-110 transition-all">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={saving} />
                    </label>
                  </div>

                  <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Display Name</label>
                      <input
                        type="text"
                        value={profile?.name || ""}
                        onChange={(e) => updateProfile({ name: e.target.value })}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-main outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Bio</label>
                      <textarea
                        value={profile?.bio || ""}
                        onChange={(e) => updateProfile({ bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-main outline-none focus:border-blue-500/50 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Avatar Color</label>
                      <div className="flex gap-3">
                        {avatarColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => updateProfile({ avatar_color: color })}
                            className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${profile?.avatar_color === color ? "ring-4 ring-white/20 scale-110" : ""
                              }`}
                            style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass rounded-3xl p-8 border border-white/10">
                <h3 className="text-lg font-bold text-main mb-6">Account Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Email Address</p>
                    <p className="text-sm font-bold text-main truncate">{user?.email}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Account ID</p>
                    <p className="text-sm font-bold text-main truncate">{user?.id}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === "search" && (
            <div className="animate-reveal">
              <SearchFilters
                region={prefs?.region}
                safe={prefs?.safe}
                perPage={prefs?.perPage}
                onChange={updatePrefs}
              />
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="glass rounded-3xl p-8 border border-white/10 animate-reveal">
              <h2 className="text-2xl font-black text-main mb-8">Appearance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  onClick={() => setTheme("light")}
                  className={`group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all ${theme === "light"
                    ? "bg-white text-slate-900 border-white shadow-2xl shadow-white/10"
                    : "bg-white/5 border-white/10 text-muted hover:bg-white/10"
                    }`}
                >
                  <div className={`p-4 rounded-2xl ${theme === "light" ? "bg-slate-100" : "bg-white/5"}`}>
                    <Sun size={32} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">Light Mode</span>
                  {theme === "light" && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />}
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all ${theme === "dark"
                    ? "bg-blue-600 text-white border-blue-500 shadow-2xl shadow-blue-500/20"
                    : "bg-white/5 border-white/10 text-muted hover:bg-white/10"
                    }`}
                >
                  <div className={`p-4 rounded-2xl ${theme === "dark" ? "bg-blue-500" : "bg-white/5"}`}>
                    <Moon size={32} />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">Dark Mode</span>
                  {theme === "dark" && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white" />}
                </button>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === "data" && (
            <div className="space-y-6 animate-reveal">
              <div className="glass rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-black text-main mb-2">Data & Privacy</h2>
                <p className="text-muted text-sm mb-8">Manage your local data and search history.</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DataCard
                    title="Search History"
                    desc="Clears recent searches shown as chips/suggestions."
                    icon={<RefreshCcw size={20} />}
                    onAction={() => { clearRecent(user?.id); notify("✅ Recent searches cleared"); }}
                    actionLabel="Clear History"
                  />
                  <DataCard
                    title="Cached Results"
                    desc="Clears stored cached search results for faster loading."
                    icon={<Database size={20} />}
                    onAction={() => { clearCache(); notify("✅ Cache cleared"); }}
                    actionLabel="Clear Cache"
                  />
                  <DataCard
                    title="Saved Results"
                    desc="Removes all bookmarked results from your account."
                    icon={<Shield size={20} />}
                    onAction={() => { clearSaved(user?.id); notify("✅ Saved results cleared"); }}
                    actionLabel="Clear Saved"
                  />
                  <DataCard
                    title="Reset Everything"
                    desc="Resets all preferences, cache, and history."
                    icon={<Trash2 size={20} />}
                    onAction={() => {
                      if (confirm("Reset everything? This cannot be undone.")) {
                        resetAll(user?.id);
                        window.location.reload();
                      }
                    }}
                    actionLabel="Reset App"
                    danger
                  />
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border border-white/10 bg-blue-500/5">
                <div className="flex gap-4">
                  <Shield className="text-blue-400 shrink-0" size={24} />
                  <div>
                    <h4 className="text-sm font-bold text-main mb-1">Privacy First</h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Your preferences and saved items are stored locally in your browser and isolated by your account.
                      We don't track your searches or sell your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === "admin" && isAdmin && (
            <div className="space-y-6 animate-reveal">
              <div className="glass rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-black text-main mb-2">Admin Console</h2>
                <p className="text-muted text-sm mb-8">System-wide management and analytics.</p>

                <div className="grid gap-6 sm:grid-cols-3 mb-10">
                  <AdminStat icon={<Users size={20} />} label="Total Users" value="1,284" color="blue" />
                  <AdminStat icon={<BarChart3 size={20} />} label="Daily Searches" value="45.2k" color="indigo" />
                  <AdminStat icon={<Activity size={20} />} label="System Health" value="99.9%" color="emerald" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-main">Quick Actions</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-main">Manage Users</p>
                        <p className="text-xs text-muted">View and edit user permissions.</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <SettingsIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-main">System Settings</p>
                        <p className="text-xs text-muted">Configure global API keys and limits.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DataCard({ title, desc, icon, onAction, actionLabel, danger }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-between">
      <div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${danger ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>
          {icon}
        </div>
        <h4 className="text-sm font-bold text-main mb-1">{title}</h4>
        <p className="text-xs text-muted leading-relaxed mb-6">{desc}</p>
      </div>
      <button
        onClick={onAction}
        className={`w-full py-3 rounded-xl text-xs font-bold transition-all active:scale-95 ${danger
          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
          : "bg-white/5 text-main hover:bg-white/10 border border-white/10"
          }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function AdminStat({ icon, label, value, color }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${color}-500/10 text-${color}-400`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-main">{value}</p>
    </div>
  );
}

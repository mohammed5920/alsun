"use client";

import { FileText, Shield, UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const navigationTabs = [
  {
    url: "/settings/profile",
    label: "Profile",
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    url: "/settings/security",
    label: "Account & Security",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    url: "/settings/billing",
    label: "Billing History",
    icon: <FileText className="h-5 w-5" />,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="animate-in fade-in mt-20 transform-gpu duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="font-alsun-serif text-secondary text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Manage your profile, account, and preferences
          </p>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav className="space-y-2">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.url}
                  onClick={() => router.push(tab.url)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold transition-colors duration-200 ${
                    pathname === tab.url
                      ? "text-primary bg-teal-50 shadow-sm"
                      : "hover:text-secondary text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="mb-20 lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}

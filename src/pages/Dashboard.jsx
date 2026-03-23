import React from 'react';

const Dashboard = () => {
  return (
    <div className="pt-24 pb-16 px-10 w-full overflow-x-hidden">

      {/* Header Section */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-anthracite dark:text-white tracking-tight">Executive Dashboard</h2>
          <p className="text-[#5e6058] dark:text-[#9e9d99] font-medium mt-2">Growth overview for the last 30 days</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-white/5 border border-[#b1b3a9]/10 dark:border-white/10 rounded-full font-headline text-sm font-bold text-anthracite dark:text-white hover:bg-[#f5f4ed] dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-anthracite dark:bg-white text-[#f5f4ed] dark:text-anthracite rounded-full font-headline text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: 'history_edu', label: 'Total Posts Generated', value: '142', prev: 'vs 120 prev.', badge: '+18.3%', badgeColor: 'text-[#006499]', badgeBg: 'bg-[#62b5f7]/20' },
          { icon: 'text_snippet', label: 'Words Written', value: '15.4k', prev: 'vs 12.1k prev.', badge: '+27.2%', badgeColor: 'text-[#006499]', badgeBg: 'bg-[#62b5f7]/20' },
          { icon: 'local_fire_department', label: 'Posting Streak', value: '12 Days', prev: 'vs 8 Days prev.', badge: '+4 Days', badgeColor: 'text-[#006499]', badgeBg: 'bg-[#62b5f7]/20' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-white/5 rounded-[2rem] p-8 shadow-sm border border-[#b1b3a9]/5 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all group duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="p-3 bg-[#f5f4ed] dark:bg-white/10 rounded-2xl group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-anthracite dark:text-white">{kpi.icon}</span>
              </div>
              <span className={`flex items-center text-xs font-bold ${kpi.badgeColor} ${kpi.badgeBg} px-3 py-1.5 rounded-full`}>
                <span className="material-symbols-outlined text-xs mr-1">{kpi.badge.startsWith('-') ? 'trending_down' : 'trending_up'}</span>
                {kpi.badge}
              </span>
            </div>
            <h3 className="text-[#5e6058] dark:text-[#9e9d99] font-body text-xs font-bold uppercase tracking-widest">{kpi.label}</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-headline font-extrabold text-anthracite dark:text-white">{kpi.value}</span>
              <span className="text-[#5e6058] dark:text-[#9e9d99] text-xs font-medium">{kpi.prev}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Central Chart Section */}
      <div className="bg-anthracite dark:bg-white/5 rounded-[3rem] p-10 mb-16 relative overflow-hidden text-[#f5f4ed] shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f5f4ed]/5 pointer-events-none" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <h3 className="text-2xl font-headline font-extrabold">Content Creation Trends</h3>
            <p className="text-[#f5f4ed]/60 text-sm mt-1">Daily words written vs posts scheduled</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#62b5f7] shadow-[0_0_10px_rgba(98,181,247,0.5)]" />
              <span className="text-xs font-bold">Words Written</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f5f4ed]/30" />
              <span className="text-xs font-bold">Target Line</span>
            </div>
          </div>
        </div>
        <div className="relative h-72 w-full z-10">
          <svg className="w-full h-full" viewBox="0 0 1000 300">
            <line className="stroke-[#f5f4ed]/5" x1="0" x2="1000" y1="50" y2="50" />
            <line className="stroke-[#f5f4ed]/5" x1="0" x2="1000" y1="150" y2="150" />
            <line className="stroke-[#f5f4ed]/5" x1="0" x2="1000" y1="250" y2="250" />
            <path className="fill-[#62b5f7]/10" d="M0,200 C150,180 300,220 450,150 S750,50 1000,100 V300 H0 Z" />
            <path className="stroke-[#62b5f7]" d="M0,200 C150,180 300,220 450,150 S750,50 1000,100" fill="none" strokeLinecap="round" strokeWidth="5" />
            <circle className="fill-[#f5f4ed] stroke-[#62b5f7] stroke-[3]" cx="450" cy="150" r="7" />
            <circle className="fill-[#f5f4ed] stroke-[#62b5f7] stroke-[3]" cx="750" cy="50" r="7" />
          </svg>
          <div className="absolute top-10 left-[76%] bg-[#f5f4ed] dark:bg-[#1e1e1c] text-anthracite dark:text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs flex flex-col items-center">
            <span className="font-bold">Oct 24, 2023</span>
            <span className="mt-1 text-[#006499] font-extrabold">1,284 Words</span>
            <span className="mt-1 text-[#5e6058] leading-none">▾</span>
          </div>
        </div>
        <div className="flex justify-between mt-8 text-[10px] text-[#f5f4ed]/40 font-bold uppercase tracking-widest px-4 z-10 relative">
          {['01 Oct', '08 Oct', '15 Oct', '22 Oct', '29 Oct'].map(d => <span key={d}>{d}</span>)}
        </div>
      </div>

      {/* Bottom Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Recent Prompts Used */}
        <div className="lg:col-span-3 bg-white dark:bg-white/5 rounded-[2.5rem] p-10 shadow-sm border border-[#b1b3a9]/5 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-headline font-extrabold text-anthracite dark:text-white">Top Formats Used</h3>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f5f4ed] dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[#5e6058] dark:text-[#9e9d99]">more_horiz</span>
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#b1b3a9]/10 dark:border-white/10">
                {['Format', 'Growth', 'Usage Share'].map((h, i) => (
                  <th key={h} className={`pb-5 text-[10px] font-bold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-[0.2em] ${i > 0 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b1b3a9]/5 dark:divide-white/5">
              {[
                { code: 'LI', name: 'Listicle / Step-by-step', growth: '+22.4%', share: '42.8%', color: 'text-[#006499]' },
                { code: 'ST', name: 'Story / Personal Experience', growth: '+12.1%', share: '18.5%', color: 'text-[#006499]' },
                { code: 'TL', name: 'Thought Leadership', growth: '-2.3%', share: '12.1%', color: 'text-[#9f403d]' },
                { code: 'AC', name: 'Actionable Tips', growth: '+5.8%', share: '9.2%', color: 'text-[#006499]' },
              ].map(format => (
                <tr key={format.code} className="group hover:bg-[#f5f4ed]/30 dark:hover:bg-white/5 transition-all cursor-default">
                  <td className="py-5 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-[#f5f4ed] dark:bg-white/10 flex items-center justify-center text-xs font-bold text-anthracite dark:text-white group-hover:scale-110 transition-transform">{format.code}</span>
                    <span className="text-sm font-bold text-anthracite dark:text-white">{format.name}</span>
                  </td>
                  <td className={`py-5 text-right text-sm font-extrabold ${format.color}`}>{format.growth}</td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-sm font-bold text-anthracite dark:text-white">{format.share}</span>
                      <div className="w-20 h-2 bg-[#f5f4ed] dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-anthracite dark:bg-white rounded-full" style={{ width: format.share }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Targets */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-[2.5rem] p-10 shadow-sm border border-[#b1b3a9]/5 dark:border-white/5 flex flex-col">
          <h3 className="text-xl font-headline font-extrabold text-anthracite dark:text-white mb-10">Performance Targets</h3>
          <div className="space-y-10 flex-1">
            {[
              { label: 'Content Output Goal', value: '15k / 20k words', pct: '76%', barColor: 'bg-[#006499]' },
              { label: 'Consistency Goal', value: '25 / 30 posts', pct: '84%', barColor: 'bg-anthracite dark:bg-white' },
            ].map(({ label, value, pct, barColor }) => (
              <div key={label}>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-sm font-bold text-anthracite dark:text-white">{label}</p>
                  <p className="text-[10px] font-extrabold text-[#5e6058] dark:text-[#9e9d99] uppercase tracking-widest">{value}</p>
                </div>
                <div className="h-4 w-full bg-[#f5f4ed] dark:bg-white/10 rounded-full overflow-hidden p-1">
                  <div className={`h-full ${barColor} rounded-full transition-all duration-1000`} style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-[#b1b3a9]/10 dark:border-white/10">
            <div className="bg-[#f5f4ed] dark:bg-white/5 p-5 rounded-3xl flex items-center gap-5 border border-white dark:border-white/5" style={{ borderRadius: '60% 40% 70% 30% / 40% 50% 50% 60%' }}>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[#006499] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <div>
                <p className="text-sm font-bold text-anthracite dark:text-white">Efficiency Boost</p>
                <p className="text-[11px] text-[#5e6058] dark:text-[#9e9d99] mt-1 font-medium leading-relaxed">Your response time is <span className="text-[#006499] font-bold">22% faster</span> than last month.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

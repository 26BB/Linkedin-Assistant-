import React from 'react';

const EngagementAnalytics = () => {
  return (
    <main className="pt-24 pb-12 px-8 lg:px-12">
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex flex-col">
          <h2 className="font-headline font-bold text-3xl text-on-surface dark:text-white tracking-tight">Engagement Intelligence</h2>
          <p className="text-on-surface-variant dark:text-[#9e9d99] font-body">Deep analysis of your LinkedIn narrative impact.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#e2e3d9] px-4 py-2 rounded-md font-medium text-sm text-[#31332c] flex items-center gap-2 hover:bg-[#d9dbcf] transition-colors">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Last 30 Days
          </button>
          <button className="bg-[#5f5e5e] text-white px-5 py-2 rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-[#535252] transition-transform active:scale-95">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </header>

      {/* Engagement Overview Hero */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Stats Card */}
          <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[320px]">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#006499] mb-2 block">Performance Core</span>
              <h3 className="font-headline text-4xl font-bold text-[#31332c] dark:text-white mb-8">Total Interactions</h3>
              <div className="flex items-baseline gap-4">
                <span className="font-headline text-7xl font-extrabold text-[#31332c] dark:text-white tracking-tighter">48.2k</span>
                <div className="flex items-center text-[#006499] font-bold bg-[#62b5f7]/20 px-3 py-1 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  12.4%
                </div>
              </div>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-8 mt-12 border-t border-[#b1b3a9]/10 pt-8">
              <div>
                <p className="text-[#5e6058] text-sm font-medium mb-1">Engagement Rate</p>
                <p className="font-headline text-2xl font-bold text-[#31332c]">5.82%</p>
              </div>
              <div>
                <p className="text-[#5e6058] text-sm font-medium mb-1">Total Shares</p>
                <p className="font-headline text-2xl font-bold text-[#31332c]">1,104</p>
              </div>
            </div>
            {/* Background SVG */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.4,-44.7C85.6,-31.3,90.8,-15.7,89.9,-0.5C89,14.6,82,29.3,73.1,42.1C64.2,54.9,53.4,65.8,40.7,73.4C28,81,14,85.3,-0.7,86.5C-15.4,87.7,-30.8,85.8,-44.3,79.1C-57.8,72.4,-69.4,60.9,-77,47.4C-84.6,33.9,-88.2,18.4,-88.7,2.8C-89.2,-12.8,-86.6,-28.5,-79.5,-42.6C-72.4,-56.7,-60.8,-69.2,-46.9,-76.1C-33,-83,-16.5,-84.3,0.3,-84.8C17.1,-85.3,34.2,-85,44.7,-76.4Z" fill="#5f5e5e" transform="translate(100 100)" />
              </svg>
            </div>
          </div>

          {/* Interaction Trends Mini-Chart */}
          <div className="bg-[#f5f4ed] dark:bg-white/5 rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h4 className="font-headline font-bold text-xl mb-1 dark:text-white">Interaction Trends</h4>
              <p className="text-sm text-[#5e6058] mb-6">Daily volume over 30 days</p>
            </div>
            <div className="flex-grow flex items-end gap-1 h-32 mb-6">
              {[40, 55, 35, 70, 85, 60, 95, 80, 90, 100].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-sm ${i < 3 ? 'bg-[#b1b3a9]/30' : i < 6 ? 'bg-[#006499]/60' : 'bg-[#5f5e5e]'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#5e6058]">AUG 01</span>
              <span className="text-xs font-bold text-[#5e6058]">AUG 30</span>
            </div>
          </div>
        </div>
      </section>

      {/* Post Performance Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline font-bold text-2xl dark:text-white">Post Performance</h3>
            <p className="text-[#5e6058]">High-fidelity analysis of individual narratives.</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-[#e2e3d9] transition-colors">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="p-2 rounded-full bg-[#e2e3d9] transition-colors">
              <span className="material-symbols-outlined">view_list</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              tag: 'Insight Article',
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMP9X39zlFFRFoVI2YwyOWhAkhRzJY3EJMTQpyS-qFozPEnGUTY0bsSLUYH06d8DhfhRck5wgk4suHYI5wLCr9IKUDgQuUnuX-cGfUEMkP0PeLIeChTUjub3cJ-e1i4W3c8DfbqPcB1Q4UyGqnStXyWsoTvbKb0h6fHi4ITvjkPs8yuYylAPzuH2Se36xnU5j_hjq2VbRsaDpeMGMyXgpduFM5_6sc5aET6679GtiTReAlGB03yW0jqC8w2Af-cWSeSdfWBSEE00e3',
              title: 'The Future of AI in Editorial Workflows: A Curator\'s Perspective',
              likes: '1.2k', comments: '84', er: '8.4%'
            },
            {
              tag: 'Case Study',
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvXKrja9pYTN1eBhXK5kZGDDkz5aenomTLVw2M0n8IwuyXvvMZkEtld8oukgTLDyg42ana_IFh4Klsl0W3KGHUzvmmKvKFCV6gGIaOAALR0Mw0hEDAz3001CIOoz2xBAdMrex-CY8mhUb_2_IaljGSpayKH0-8QAy0XjylE7PG0r6Kxx8EQcwBtww2UQfrOavAh_wf3bvBAiGt2qBQRCJ3_RA3JrrxLjN871YEF4vBPBHHiwE1WweTiSeA7YiUQY40ELRUL06sShAT',
              title: 'How we scaled our LinkedIn engagement by 300% in 90 days.',
              likes: '850', comments: '120', er: '12.1%'
            },
            {
              tag: 'Opinion',
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3leyfuXA1EsAfQfHmU3rJvDEaFgqU0j0jw1floYcl_8XqNxz8BTzEiTw1T-ckOcGo0EzSO3Sr1TYC7QsgC7kHHQgFVyboNiqIBaEV7dGXNsX0snLYC5rQZe0W5iaX7K_auGXC4xUTBK6yZMCUam_dlwX-W5ka1-HpC4siY5GymquvYHjBOI9ubpDpAwzR8L1Dl0Meww5QFmvR00AN34GVk_4b3ienWHrvvnxw5D79HufghJIk6N5DsFXB4eY9OjckLhXQ284JAJUm',
              title: 'Why the algorithm is favoring long-form text over visuals in 2024.',
              likes: '2.4k', comments: '42', er: '6.2%'
            },
          ].map((post, i) => (
            <div key={i} className="bg-white dark:bg-white/5 rounded-xl overflow-hidden group border border-transparent hover:border-[#b1b3a9]/20 dark:hover:border-white/10 transition-all">
              <div className="h-40 bg-[#e2e3d9] overflow-hidden relative">
                <img
                  src={post.img}
                  alt={post.tag}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#31332c]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                  {post.tag}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-headline font-bold text-lg mb-4 line-clamp-2 leading-tight dark:text-white">{post.title}</h4>
                <div className="flex justify-between items-center text-[#5e6058] text-sm font-medium pt-4 border-t border-[#b1b3a9]/10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">thumb_up</span> {post.likes}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">fiber_manual_record</span> {post.comments}</span>
                  </div>
                  <div className="flex items-center text-[#006499]">
                    <span className="font-bold">{post.er} ER</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Bento Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Heatmap */}
        <div className="lg:col-span-3 bg-white dark:bg-white/5 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-headline font-bold text-xl dark:text-white">Best Time to Post</h3>
              <p className="text-sm text-[#5e6058]">Recommended times for maximum reach.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#5f5e5e] uppercase">Peak: Tues 10 AM</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { day: 'MON', cols: [0, 1, 2, 3, 4, 5, 3, 0] },
              { day: 'TUE', cols: [0, 2, 4, 5, 6, 5, 4, 0] },
              { day: 'WED', cols: [0, 1, 2, 3, 4, 5, 3, 0] },
              { day: 'THU', cols: [0, 1, 3, 4, 5, 4, 3, 0] },
              { day: 'FRI', cols: [1, 2, 3, 3, 2, 1, 0, 0] },
            ].map(({ day, cols }) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-8 text-[10px] font-bold text-[#5e6058]">{day}</span>
                <div className="flex-grow flex gap-1 h-6">
                  {cols.map((level, i) => {
                    const bg = level === 0 ? 'bg-[#efeee6]' : level === 1 ? 'bg-[#e2e3d9]' : level === 2 ? 'bg-[#006499]/20' : level === 3 ? 'bg-[#006499]/40' : level === 4 ? 'bg-[#006499]/60' : level === 5 ? 'bg-[#006499]' : 'bg-[#5f5e5e]';
                    return <div key={i} className={`flex-grow ${bg} rounded-sm`} />;
                  })}
                </div>
              </div>
            ))}
            <div className="flex justify-between pl-10 mt-2 text-[9px] font-bold text-[#5e6058]/60 uppercase tracking-widest">
              {['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#5f5e5e] text-white rounded-xl p-8 flex-grow">
            <h3 className="font-headline font-bold text-xl mb-6">Top Professional Roles</h3>
            <div className="space-y-4">
              {[{ label: 'Chief Technology Officers', pct: 34 }, { label: 'Content Strategists', pct: 28 }, { label: 'Editorial Directors', pct: 19 }].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{label}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-white h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#e8e9e0] rounded-xl p-8 border border-[#b1b3a9]/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full">
                <span className="material-symbols-outlined text-[#5f5e5e]">psychology</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#5e6058] uppercase tracking-wider">AI Recommendation</p>
                <p className="text-sm font-semibold text-[#31332c] leading-tight mt-1">Focus on technical leadership topics for higher CTO engagement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EngagementAnalytics;

export default function ChartCard({ title, icon, children, codeReveal }) {
  return (
    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 card-hover shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ff1c2e]/10 rounded-lg text-[#ff1c2e]">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ff1c2e]/60"></div>
          <div className="w-2 h-2 rounded-full bg-[#ff1c2e]/40"></div>
          <div className="w-2 h-2 rounded-full bg-[#ff1c2e]/20"></div>
        </div>
      </div>
      
      <div className="bg-[#080808] rounded-xl p-4 h-[320px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff1c2e]/5 to-transparent pointer-events-none"></div>
        <div className="relative h-full w-full">
          {children}
        </div>
      </div>

      {codeReveal && (
        <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
          {codeReveal}
        </div>
      )}
    </div>
  );
}

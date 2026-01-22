export default function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 card-hover shadow-lg shadow-black/20 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-[#ff1c2e] text-sm mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-[#ff1c2e]/10 rounded-xl text-[#ff1c2e] group-hover:bg-[#ff1c2e]/20 transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

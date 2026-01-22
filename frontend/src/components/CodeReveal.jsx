import { useState } from 'react';
import { Database, ArrowDown, Lightbulb, Target, Zap, Chevron } from './F1Icons';

export default function CodeReveal({ title, code, explanation, whyNeeded, keyInsights }) {
  const [isOpen, setIsOpen] = useState(false);

  // Format SQL code with syntax highlighting
  const formatSQL = (sql) => {
    if (!sql) return '';
    
    const keywords = /\b(SELECT|FROM|WHERE|INNER JOIN|LEFT JOIN|RIGHT JOIN|JOIN|ON|AND|OR|GROUP BY|ORDER BY|HAVING|LIMIT|AS|COUNT|SUM|AVG|MIN|MAX|DISTINCT|CASE|WHEN|THEN|ELSE|END|IN|NOT|NULL|IS|LIKE|BETWEEN|DESC|ASC|CONCAT|ROUND|FLOOR|WITH|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|INDEX|TABLE|VALUES)\b/gi;
    const comments = /(--[^\n]*)/g;
    const strings = /('[^']*')/g;
    const numbers = /\b(\d+\.?\d*)\b/g;
    const parameters = /(@\w+|\?)/g;

    return sql
      .replace(comments, '<span class="text-[#6b7280] italic">$1</span>')
      .replace(strings, '<span class="text-[#fbbf24]">$1</span>')
      .replace(keywords, '<span class="text-[#60a5fa] font-semibold">$1</span>')
      .replace(parameters, '<span class="text-[#c084fc]">$1</span>')
      .replace(numbers, '<span class="text-[#34d399]">$1</span>');
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#1a1a1a] to-[#141414] border border-[#2a2a2a] rounded-xl text-sm font-medium text-gray-300 hover:border-[#ff1c2e]/50 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#ff1c2e]/10"
      >
        <Database className="w-4 h-4 text-[#ff1c2e]" />
        <span>{isOpen ? 'Hide SQL Query' : 'Show SQL Query'}</span>
        <ArrowDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 slide-in">
          <div className="bg-[#0c0c0c] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-2xl">
            {/* Code Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#151515] to-[#0f0f0f] border-b border-[#1f1f1f]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-lg shadow-[#ff5f56]/30"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-lg shadow-[#ffbd2e]/30"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-lg shadow-[#27c93f]/30"></div>
                </div>
                <span className="text-sm font-mono text-gray-400 pl-3 border-l border-[#2a2a2a]">{title}</span>
              </div>
              <span className="text-xs font-mono text-[#ff1c2e] bg-[#ff1c2e]/10 px-2 py-1 rounded">SQL</span>
            </div>

            {/* SQL Code Block */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col pt-4">
                {code.split('\n').map((_, i) => (
                  <span key={i} className="text-[10px] text-gray-600 text-right pr-3 leading-6 font-mono">
                    {i + 1}
                  </span>
                ))}
              </div>
              <pre className="pl-14 pr-4 py-4 overflow-x-auto text-sm bg-[#0a0a0a] font-mono leading-6">
                <code 
                  className="text-gray-300"
                  dangerouslySetInnerHTML={{ __html: formatSQL(code) }}
                />
              </pre>
            </div>

            {/* Explanation Section */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#0f1f0f] to-[#0a0a0a] border-t border-[#1a2a1a]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#22c55e]/10 rounded-lg shrink-0">
                  <Lightbulb className="w-4 h-4 text-[#22c55e]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#22c55e] mb-1.5 tracking-wide uppercase text-[11px]">Explanation</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{explanation}</p>
                </div>
              </div>
            </div>

            {/* Why We Need This Section */}
            {whyNeeded && (
              <div className="px-5 py-4 bg-gradient-to-r from-[#1f1f0f] to-[#0a0a0a] border-t border-[#2a2a1a]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#eab308]/10 rounded-lg shrink-0">
                    <Target className="w-4 h-4 text-[#eab308]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#eab308] mb-1.5 tracking-wide uppercase text-[11px]">Why We Need This</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{whyNeeded}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Insights Section */}
            {keyInsights && keyInsights.length > 0 && (
              <div className="px-5 py-4 bg-gradient-to-r from-[#1f0f1f] to-[#0a0a0a] border-t border-[#2a1a2a]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#ff1c2e]/10 rounded-lg shrink-0">
                    <Zap className="w-4 h-4 text-[#ff1c2e]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#ff1c2e] mb-3 tracking-wide uppercase text-[11px]">Key Insights</p>
                    <ul className="text-sm text-gray-400 space-y-2">
                      {keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 group">
                          <Chevron className="w-3 h-3 text-[#ff1c2e] mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                          <span className="leading-relaxed">{insight.replace(/^[^\s]+\s/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
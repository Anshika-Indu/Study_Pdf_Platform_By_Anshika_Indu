'use client'

interface ToolbarProps {
  fileName: string
  onHighlight: () => void
  onUnderline: () => void
  onAddNote: () => void
  onExplain: () => void
  onSearch: () => void
  activeMode: 'none' | 'highlight' | 'underline'
  isExplaining: boolean
  selectedText: string
}

export default function Toolbar({
  fileName,
  onHighlight,
  onUnderline,
  onAddNote,
  onExplain,
  onSearch,
  activeMode,
  isExplaining,
  selectedText,
}: ToolbarProps) {
  const tools = [
    {
      id: 'highlight',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      label: 'Highlight',
      onClick: onHighlight,
      active: activeMode === 'highlight',
      color: '#F59E0B',
    },
    {
      id: 'underline',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 20h16M8 4v8a4 4 0 008 0V4" />
        </svg>
      ),
      label: 'Underline',
      onClick: onUnderline,
      active: activeMode === 'underline',
      color: '#06B6D4',
    },
    {
      id: 'note',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      label: 'Note',
      onClick: onAddNote,
      active: false,
      color: '#10B981',
    },
  ]

  const aiTools = [
    {
      id: 'explain',
      icon: isExplaining ? (
        <span className="w-4 h-4 border border-white/60 border-t-transparent rounded-full animate-spin block" />
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      label: 'Explain',
      onClick: onExplain,
      disabled: !selectedText || isExplaining,
    },
    {
      id: 'search',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Search',
      onClick: onSearch,
      disabled: false,
    },
  ]

  return (
    <div className="glass border-b flex items-center gap-2 px-4 py-2 overflow-x-auto"
      style={{ borderColor: 'var(--border-subtle)' }}>
      {/* File name */}
      <span className="text-sm font-display font-semibold text-white truncate max-w-[180px] mr-2 flex-shrink-0">
        {fileName.replace('.pdf', '')}
      </span>

      <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />

      {/* Annotation tools */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.onClick}
            title={tool.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tool.active
                ? 'text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            style={tool.active ? { background: `${tool.color}22`, color: tool.color } : {}}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />

      {/* AI tools */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {aiTools.map((tool) => (
          <button
            key={tool.id}
            onClick={tool.onClick}
            disabled={tool.disabled}
            title={tool.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(96,71,255,0.15)', color: '#a78bfa' }}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>

      {selectedText && (
        <>
          <div className="w-px h-5 flex-shrink-0" style={{ background: 'var(--border-subtle)' }} />
          <span className="text-xs truncate max-w-[140px]" style={{ color: 'var(--text-muted)' }}>
            &ldquo;{selectedText.slice(0, 40)}{selectedText.length > 40 ? '…' : ''}&rdquo;
          </span>
        </>
      )}
    </div>
  )
}

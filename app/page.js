'use client';

import { useState, useMemo } from 'react';

// Real data from Account 57
const tagData = [
  { id: 4393, name: "Exercise", taggings_count: 4774, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 2500, tags: 2274 } },
  { id: 5219, name: "Virtual", taggings_count: 4114, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 2100, tags: 2014 } },
  { id: 4361, name: "Meeting", taggings_count: 3399, context_count: 1, contexts: "tags", context_counts: { tags: 3399 } },
  { id: 4330, name: "Juliana Berfield", taggings_count: 2292, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 1200, tags: 1092 } },
  { id: 3962, name: "Webinar", taggings_count: 1707, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 900, tags: 807 } },
  { id: 4391, name: "Meditation", taggings_count: 1363, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 700, tags: 663 } },
  { id: 5302, name: "In-Person", taggings_count: 1110, context_count: 1, contexts: "tags", context_counts: { tags: 1110 } },
  { id: 4398, name: "Ramel Rones", taggings_count: 1018, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 500, tags: 518 } },
  { id: 4394, name: "Strength Training", taggings_count: 951, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 480, tags: 471 } },
  { id: 4396, name: "Nancy Campbell", taggings_count: 950, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 475, tags: 475 } },
  { id: 4399, name: "Tai Chi", taggings_count: 597, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 300, tags: 297 } },
  { id: 5237, name: "Chair Yoga Flow", taggings_count: 554, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 280, tags: 274 } },
  { id: 3897, name: "Video", taggings_count: 551, context_count: 1, contexts: "resource_tags", context_counts: { resource_tags: 551 } },
  { id: 4400, name: "Qigong", taggings_count: 484, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 250, tags: 234 } },
  { id: 4386, name: "Expressive Arts", taggings_count: 469, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 240, tags: 229 } },
  { id: 5547, name: "Megan Carleton", taggings_count: 387, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 200, tags: 187 } },
  { id: 5221, name: "Mindfulness Meditation", taggings_count: 376, context_count: 1, contexts: "tags", context_counts: { tags: 376 } },
  { id: 5304, name: "Dance & Movement", taggings_count: 346, context_count: 1, contexts: "tags", context_counts: { tags: 346 } },
  { id: 5236, name: "Yoga Flow", taggings_count: 343, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 175, tags: 168 } },
  { id: 5303, name: "Aerobic/Cardio Workout", taggings_count: 309, context_count: 1, contexts: "tags", context_counts: { tags: 309 } },
  { id: 5988, name: "Low Impact", taggings_count: 308, context_count: 1, contexts: "resource_tags", context_counts: { resource_tags: 308 } },
  { id: 5933, name: "Beginner", taggings_count: 305, context_count: 1, contexts: "resource_tags", context_counts: { resource_tags: 305 } },
  { id: 4289, name: "Nutrition", taggings_count: 285, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 145, tags: 140 } },
  { id: 5234, name: "Chair Stretch & Strength", taggings_count: 270, context_count: 2, contexts: "resource_tags,tags", context_counts: { resource_tags: 140, tags: 130 } },
  { id: 5305, name: "Patricia Arcari", taggings_count: 265, context_count: 1, contexts: "tags", context_counts: { tags: 265 } },
];

const orphanedCount = 12;
const lowUseCount = 45;

export default function TagManager() {
  const [tags, setTags] = useState(tagData);
  const [searchTerm, setSearchTerm] = useState('');
  const [contextFilter, setContextFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState('all');
  const [sortField, setSortField] = useState('taggings_count');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedContexts, setExpandedContexts] = useState({});
  const [selectedTag, setSelectedTag] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [mergeTarget, setMergeTarget] = useState('');
  const [mergeContext, setMergeContext] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredTags = useMemo(() => {
    let result = [...tags];
    
    if (searchTerm) {
      result = result.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (contextFilter !== 'all') {
      result = result.filter(tag => 
        tag.contexts.includes(contextFilter)
      );
    }
    
    if (usageFilter === 'orphaned') {
      result = result.filter(tag => tag.taggings_count === 0);
    } else if (usageFilter === 'low') {
      result = result.filter(tag => tag.taggings_count > 0 && tag.taggings_count <= 10);
    } else if (usageFilter === 'high') {
      result = result.filter(tag => tag.taggings_count > 100);
    }
    
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    return result;
  }, [tags, searchTerm, contextFilter, usageFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleContextExpand = (tagId) => {
    setExpandedContexts(prev => ({
      ...prev,
      [tagId]: !prev[tagId]
    }));
  };

  const openModal = (type, tag) => {
    setSelectedTag(tag);
    setModalType(type);
    setActiveDropdown(null);
    if (type === 'rename') {
      setRenameValue(tag.name);
    } else if (type === 'merge') {
      setMergeTarget('');
      setMergeContext('');
    } else if (type === 'delete') {
      setDeleteConfirmText('');
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTag(null);
    setRenameValue('');
    setMergeTarget('');
    setMergeContext('');
    setDeleteConfirmText('');
  };

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== selectedTag.name) {
      setTags(prev => prev.map(tag => 
        tag.id === selectedTag.id ? { ...tag, name: renameValue.trim(), updated_at: new Date().toISOString().split('T')[0] } : tag
      ));
      closeModal();
    }
  };

  const handleMerge = () => {
    if (mergeTarget && mergeContext) {
      const targetTag = tags.find(t => t.id === parseInt(mergeTarget));
      if (targetTag) {
        const mergeCount = selectedTag.context_counts[mergeContext] || 0;
        setTags(prev => prev
          .map(tag => {
            if (tag.id === targetTag.id) {
              // Add to target tag
              const newContextCounts = { ...tag.context_counts };
              newContextCounts[mergeContext] = (newContextCounts[mergeContext] || 0) + mergeCount;
              const newContexts = Object.keys(newContextCounts).filter(k => newContextCounts[k] > 0).join(',');
              return { 
                ...tag, 
                taggings_count: tag.taggings_count + mergeCount,
                context_counts: newContextCounts,
                contexts: newContexts,
                context_count: newContexts.split(',').length
              };
            } else if (tag.id === selectedTag.id) {
              // Remove from source tag
              const newContextCounts = { ...tag.context_counts };
              delete newContextCounts[mergeContext];
              const remainingCount = Object.values(newContextCounts).reduce((a, b) => a + b, 0);
              if (remainingCount === 0) {
                return null; // Will be filtered out
              }
              const newContexts = Object.keys(newContextCounts).filter(k => newContextCounts[k] > 0).join(',');
              return {
                ...tag,
                taggings_count: remainingCount,
                context_counts: newContextCounts,
                contexts: newContexts,
                context_count: newContexts.split(',').length
              };
            }
            return tag;
          })
          .filter(Boolean)
        );
        closeModal();
      }
    }
  };

  const handleDelete = () => {
    if (selectedTag.taggings_count > 10 && deleteConfirmText !== 'DELETE') {
      return;
    }
    setTags(prev => prev.filter(tag => tag.id !== selectedTag.id));
    closeModal();
  };

  const SortIcon = ({ field }) => (
    <span className="ml-1 text-xs">
      {sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  const totalTaggings = tags.reduce((sum, tag) => sum + tag.taggings_count, 0);

  return (
    <div className="flex h-screen bg-gray-100 text-sm">
      {/* Sidebar */}
      <div className="w-48 bg-gray-700 text-white flex flex-col">
        <div className="p-3 bg-gray-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold">d</div>
          <span className="font-semibold text-sm">Sandbox</span>
          <span className="text-xs text-gray-400">▼</span>
        </div>
        
        <nav className="flex-1 py-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-600">
            <span className="text-green-400">📊</span> DASHBOARD
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-600">
            <span className="text-blue-400">📱</span> APPLICATIONS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-600">
            <span className="text-red-400">👥</span> PEOPLE
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-600">
            <span className="text-yellow-400">🔧</span> TOOLS
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-600">
            <span className="text-pink-400">🎨</span> CUSTOMIZE
          </a>
          <div className="border-t border-gray-600 mt-2 pt-2">
            <a href="#" className="flex items-center gap-3 px-4 py-2 bg-gray-600 text-white">
              <span className="text-gray-400">⚙️</span> SETTINGS
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-2 text-gray-400 text-xs hover:bg-gray-600">
              PLATFORM
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-2 text-gray-400 text-xs hover:bg-gray-600">
              CATEGORIES
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-2 bg-gray-500 text-white text-xs">
              TAG MANAGER
            </a>
            <a href="#" className="flex items-center gap-3 px-8 py-2 text-gray-400 text-xs hover:bg-gray-600">
              APPLICATIONS
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="border border-gray-300 rounded px-3 py-1 text-sm w-48"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <span className="text-gray-500">❓</span>
            <span className="text-gray-600 text-sm">🌐 Language ▼</span>
            <span className="text-gray-600 text-sm">👤 Platform ▼</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-2">
            <span>🏠</span> &gt; <span>Settings</span> &gt; <span className="text-gray-700">Tag Manager</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl text-gray-700">Tag Manager</h1>
            <div className="flex items-center gap-2">
              <button className="border border-gray-300 bg-white px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-50">
                📤 Export CSV
              </button>
              <button className="border border-gray-300 bg-white px-3 py-1.5 rounded text-sm text-gray-600 hover:bg-gray-50">
                🔄 Recalculate Counts
              </button>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-white border border-gray-200 rounded mb-4 p-4 flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-700">{tags.length}</div>
              <div className="text-xs text-gray-500">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-500">{orphanedCount}</div>
              <div className="text-xs text-gray-500">Orphaned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-700">{totalTaggings.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Taggings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-500">{lowUseCount}</div>
              <div className="text-xs text-gray-500">Low Use (&lt;10)</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded mb-4 p-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Context:</label>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={contextFilter}
                onChange={(e) => setContextFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="tags">tags</option>
                <option value="resource_tags">resource_tags</option>
                <option value="lo_tags">lo_tags</option>
                <option value="question_tags">question_tags</option>
                <option value="qb_tags">qb_tags</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Usage:</label>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                value={usageFilter}
                onChange={(e) => setUsageFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="orphaned">Orphaned (0)</option>
                <option value="low">Low (1-10)</option>
                <option value="high">High (100+)</option>
              </select>
            </div>
            <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
              💾 Save Filter
            </button>
            <div className="flex-1"></div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tags..."
                className="border border-gray-300 rounded px-3 py-1 text-sm w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th 
                    className="text-left px-4 py-3 text-xs font-semibold text-orange-500 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    NAME <SortIcon field="name" />
                  </th>
                  <th 
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('taggings_count')}
                  >
                    USAGE COUNT <SortIcon field="taggings_count" />
                  </th>
                  <th 
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('context_count')}
                  >
                    CONTEXTS <SortIcon field="context_count" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag, index) => (
                  <tr key={tag.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-3 text-gray-700">{tag.name}</td>
                    <td className="px-4 py-3 text-gray-600">{tag.taggings_count.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {tag.context_count === 1 ? (
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                          {tag.contexts}
                        </span>
                      ) : (
                        <div>
                          <button 
                            onClick={() => toggleContextExpand(tag.id)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            {tag.context_count} contexts {expandedContexts[tag.id] ? '▼' : '▶'}
                          </button>
                          {expandedContexts[tag.id] && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {tag.contexts.split(',').map(ctx => (
                                <span key={ctx} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                                  {ctx}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === tag.id ? null : tag.id)}
                        className="border border-gray-300 bg-white px-2 py-1 rounded text-gray-500 hover:bg-gray-50"
                      >
                        ⚙️ ▼
                      </button>
                      {activeDropdown === tag.id && (
                        <div className="absolute right-4 top-10 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-32">
                          <button 
                            onClick={() => openModal('rename', tag)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            ✏️ Rename
                          </button>
                          <button 
                            onClick={() => openModal('merge', tag)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            🔀 Merge
                          </button>
                          <button 
                            onClick={() => openModal('delete', tag)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Showing {filteredTags.length} of {tags.length} tags
            </div>
            <div className="flex items-center gap-1">
              <button className="border border-gray-300 bg-white px-2 py-1 rounded text-xs hover:bg-gray-50">◀</button>
              <button className="border border-orange-500 bg-orange-500 text-white px-2 py-1 rounded text-xs">1</button>
              <button className="border border-gray-300 bg-white px-2 py-1 rounded text-xs hover:bg-gray-50">2</button>
              <button className="border border-gray-300 bg-white px-2 py-1 rounded text-xs hover:bg-gray-50">▶</button>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white ml-2">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {modalType === 'rename' && selectedTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Rename Tag</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Renaming this tag will update it across <strong>{selectedTag.taggings_count.toLocaleString()}</strong> items.
              </p>
              <label className="block text-xs text-gray-600 mb-1">Tag Name</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={closeModal}
                className="border border-gray-300 bg-white px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRename}
                disabled={!renameValue.trim() || renameValue === selectedTag.name}
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {modalType === 'merge' && selectedTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Merge Tag</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Source tag:</strong> &quot;{selectedTag.name}&quot; ({selectedTag.taggings_count.toLocaleString()} total uses)
                </p>
              </div>
              
              <label className="block text-xs text-gray-600 mb-1">Select context to merge</label>
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white mb-4"
                value={mergeContext}
                onChange={(e) => setMergeContext(e.target.value)}
              >
                <option value="">Select a context...</option>
                {selectedTag.contexts.split(',').map(ctx => (
                  <option key={ctx} value={ctx}>
                    {ctx} ({(selectedTag.context_counts[ctx] || 0).toLocaleString()} uses)
                  </option>
                ))}
              </select>

              {mergeContext && (
                <>
                  <label className="block text-xs text-gray-600 mb-1">Merge into (target tag)</label>
                  <select 
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                    value={mergeTarget}
                    onChange={(e) => setMergeTarget(e.target.value)}
                  >
                    <option value="">Select a tag...</option>
                    {tags
                      .filter(t => t.id !== selectedTag.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name} ({tag.taggings_count.toLocaleString()} uses)
                        </option>
                      ))
                    }
                  </select>
                </>
              )}

              {mergeContext && mergeTarget && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Preview:</strong> {(selectedTag.context_counts[mergeContext] || 0).toLocaleString()} taggings from &quot;{mergeContext}&quot; context will be moved to &quot;{tags.find(t => t.id === parseInt(mergeTarget))?.name}&quot;. 
                    {selectedTag.context_count > 1 && ` Other contexts will remain on "${selectedTag.name}".`}
                    {selectedTag.context_count === 1 && ` "${selectedTag.name}" will be deleted.`}
                  </p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={closeModal}
                className="border border-gray-300 bg-white px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleMerge}
                disabled={!mergeTarget || !mergeContext}
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Merge Context
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-red-50">
              <h3 className="font-semibold text-red-700">Delete Tag</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-4">
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> You are about to delete &quot;{selectedTag.name}&quot;
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                This tag will be removed from <strong>{selectedTag.taggings_count.toLocaleString()}</strong> items:
              </p>
              <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                <li>Courses, learning objects, resources, etc. will remain</li>
                <li>Only the tag association will be removed</li>
                <li>This action cannot be undone</li>
              </ul>
              {selectedTag.taggings_count > 10 && (
                <div className="mt-4">
                  <label className="block text-xs text-gray-600 mb-1">
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <input 
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                  />
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
              <button 
                onClick={closeModal}
                className="border border-gray-300 bg-white px-4 py-2 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={selectedTag.taggings_count > 10 && deleteConfirmText !== 'DELETE'}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}

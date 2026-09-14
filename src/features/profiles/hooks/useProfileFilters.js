import { useState, useMemo } from 'react';

/**
 * Custom hook for managing search, filter, sort, view mode, and stats calculations
 */
export function useProfileFilters(profiles = [], selectedGroup = 'All', customGroups = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'running' | 'idle'
  const [osFilter, setOsFilter] = useState('all'); // 'all' | 'windows' | 'macos' | 'linux'
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'oldest' | 'name-asc' | 'name-desc'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [showStatsRibbon, setShowStatsRibbon] = useState(true);

  // Stats calculation
  const totalCount = profiles.length;
  const runningCount = profiles.filter(p => p.status === 'running').length;
  const idleCount = totalCount - runningCount;
  const proxyCount = profiles.filter(p => p.proxy?.host).length;

  // Filtered & Sorted Profiles
  const filteredProfiles = useMemo(() => {
    let result = profiles.filter(p => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.proxy?.host && p.proxy.host.includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.group && p.group.toLowerCase().includes(q));

      const matchGroup = selectedGroup === 'All' || p.group === selectedGroup;
      const matchStatus = statusFilter === 'all' ||
        (statusFilter === 'running' && p.status === 'running') ||
        (statusFilter === 'idle' && p.status !== 'running');
      const matchOs = osFilter === 'all' || (p.os && p.os.toLowerCase() === osFilter.toLowerCase());

      return matchSearch && matchGroup && matchStatus && matchOs;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(b.name);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // latest
    });

    return result;
  }, [profiles, searchTerm, selectedGroup, statusFilter, osFilter, sortBy]);

  // Distinct list of all available groups (only real custom groups + existing profile groups + 'Chung')
  const allGroups = useMemo(() => {
    const fromCustom = customGroups.map(g => g.name).filter(Boolean);
    const fromProfiles = profiles.map(p => p.group).filter(Boolean);
    return Array.from(new Set(['Chung', ...fromCustom, ...fromProfiles]));
  }, [profiles, customGroups]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    osFilter,
    setOsFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    showStatsRibbon,
    setShowStatsRibbon,
    totalCount,
    runningCount,
    idleCount,
    proxyCount,
    filteredProfiles,
    allGroups
  };
}

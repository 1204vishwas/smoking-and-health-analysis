import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TabNavigation from './components/TabNavigation';
import TabOverview from './components/TabOverview';
import TabSmokingPatterns from './components/TabSmokingPatterns';
import TabDemographics from './components/TabDemographics';
import TabPatientExplorer from './components/TabPatientExplorer';
import TabDAXReference from './components/TabDAXReference';
import { AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [kpiData, setKpiData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [daxData, setDaxData] = useState(null);

  // Patient table state
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const initialFilters = {
    region: 'All',
    gender: 'All',
    ageGroup: 'All',
    smokingStatus: 'All',
    bpRisk: 'All',
    organ: 'All',
    condition: 'All',
    exposureCategory: 'All',
    startDate: '',
    endDate: '',
    search: ''
  };

  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convert filter state to URL query string
  const buildQueryString = useCallback((currentFilters, extra = {}) => {
    const params = new URLSearchParams();
    Object.entries({ ...currentFilters, ...extra }).forEach(([key, val]) => {
      if (val && val !== 'All') {
        params.append(key, val);
      }
    });
    return params.toString();
  }, []);

  // Fetch KPI and Analytical Overview
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(filters);
      const [kpiRes, overviewRes, daxRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/kpis?${qs}`),
        fetch(`${API_BASE}/analytics/overview?${qs}`),
        fetch(`${API_BASE}/dax-definitions`)
      ]);

      if (!kpiRes.ok || !overviewRes.ok) {
        throw new Error('Failed to fetch analytics from backend server');
      }

      const kpiJson = await kpiRes.json();
      const overviewJson = await overviewRes.json();
      const daxJson = daxRes.ok ? await daxRes.json() : null;

      setKpiData(kpiJson);
      setOverviewData(overviewJson);
      setDaxData(daxJson);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Cannot connect to backend server. Make sure backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, buildQueryString]);

  // Fetch Paginated Patients for Table
  const fetchPatients = useCallback(async () => {
    try {
      const qs = buildQueryString(filters, { page, limit });
      const res = await fetch(`${API_BASE}/patients?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch patient records');
      const data = await res.json();
      setPatients(data.patients || []);
      setTotalPatients(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Patient Fetch Error:', err);
    }
  }, [filters, page, limit, buildQueryString]);

  // Load analytics when filters change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Load patient list when page, limit, or filters change
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Handle individual filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setPage(1); // Reset page on filter change
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
    setPage(1);
  };

  // Handle search term input with debounce
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setFilters((prev) => ({ ...prev, search: val }));
    setPage(1);
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const qs = buildQueryString(filters);
    window.open(`${API_BASE}/patients/export?${qs}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Sapphire IQ Header */}
      <Header
        totalRecords={overviewData?.totalRecords || 10000}
        filteredCount={kpiData?.totalPatients ?? 10000}
        onResetFilters={handleResetFilters}
        onExportCSV={handleExportCSV}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isLoading={isLoading}
      />

      {/* Power BI Style Slicers / Filters Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Report Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Error Banner if Backend is not reachable */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-2.5 py-1 bg-rose-600 text-white font-semibold rounded hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab 1: Executive Overview & KPIs */}
        {activeTab === 'overview' && (
          <TabOverview
            kpiData={kpiData}
            overviewData={overviewData}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Smoking Patterns & Health Indicators */}
        {activeTab === 'patterns' && (
          <TabSmokingPatterns
            overviewData={overviewData}
            kpiData={kpiData}
          />
        )}

        {/* Tab 3: Demographics & Exposure Analysis */}
        {activeTab === 'demographics' && (
          <TabDemographics
            overviewData={overviewData}
            kpiData={kpiData}
          />
        )}

        {/* Tab 4: Patient Record Explorer */}
        {activeTab === 'patients' && (
          <TabPatientExplorer
            patients={patients}
            totalPatients={totalPatients}
            page={page}
            limit={limit}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={setLimit}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onExportCSV={handleExportCSV}
            isLoading={isLoading}
          />
        )}

        {/* Tab 5: DAX Reference & Power BI Architecture */}
        {activeTab === 'dax' && (
          <TabDAXReference
            daxData={daxData}
            kpiData={kpiData}
          />
        )}
      </main>

      {/* Footer matching Sapphire IQ Document Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SAPPHIRE IQ</span>
            <span>&bull;</span>
            <span>Brilliant Minds Intelligent Solutions</span>
            <span>&bull;</span>
            <span className="text-blue-600 font-medium">Healthcare Analytics Practice</span>
          </div>
          <div>
            <span>Project Presentation &bull; Microsoft Power BI &bull; 10,000 Patient Cohort</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

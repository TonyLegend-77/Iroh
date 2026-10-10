'use client';
import { useState } from 'react';
import InstrumentSearch from '@/components/InstrumentSearch';
import EvidencePanel from '@/components/EvidencePanel';
import ThesisManager from '@/components/ThesisManager';

interface Instrument { instrumentId: string; symbol: string; companyName: string; productType: string; }

export default function Home() {
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thesis Desk</h1>
            <p className="text-sm text-slate-500 mt-0.5">Research & analyze instruments with real-time market data</p>
          </div>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">TD</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search & Theses (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Instrument Search</h2>
              <InstrumentSearch onInstrumentSelect={setSelectedInstrument} />
              
              {selectedInstrument && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">SELECTED</div>
                  <div className="font-bold text-blue-900 text-lg">{selectedInstrument.symbol}</div>
                  <div className="text-sm text-blue-700 mt-1">{selectedInstrument.companyName}</div>
                  <div className="text-xs text-blue-500 font-mono mt-2">{selectedInstrument.instrumentId}</div>
                </div>
              )}
            </div>

            <ThesisManager selectedInstrument={selectedInstrument} />
          </div>

          {/* Right Column: Evidence (8 cols) */}
          <div className="lg:col-span-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Market Evidence</h2>
            <EvidencePanel instrumentId={selectedInstrument?.instrumentId || ''} />
          </div>

        </div>
      </main>
    </div>
  );
}

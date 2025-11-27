import React, { useState, useEffect } from 'react';
import { GenerationParams, ContentType, Tone, Preset } from '../types';
import { Sparkles, Loader2, Lightbulb, ArrowRight, Wand2, Bookmark, Save, Trash2, FolderOpen } from 'lucide-react';
import { generateTopicSuggestions } from '../services/geminiService';

interface GeneratorFormProps {
  isLoading: boolean;
  onSubmit: (params: GenerationParams) => Promise<void>;
  initialParams?: GenerationParams | null;
  remainingCredits?: number;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ isLoading, onSubmit, initialParams, remainingCredits = 0 }) => {
  const [formData, setFormData] = useState<GenerationParams>({
    topic: '',
    contentType: ContentType.BLOG_POST,
    audience: '',
    tone: Tone.PROFESSIONAL,
    wordCount: '',
    specialRequirements: ''
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  // Preset State
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Load params if provided (e.g. from History)
  useEffect(() => {
    if (initialParams) {
      setFormData(initialParams);
    }
  }, [initialParams]);

  // Load Presets from LocalStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem('cc_presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse presets");
      }
    }
  }, []);

  const savePreset = () => {
    if (!newPresetName.trim()) return;
    
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: newPresetName,
      params: { ...formData }
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('cc_presets', JSON.stringify(updatedPresets));
    
    setNewPresetName('');
    setShowSavePreset(false);
    setSelectedPresetId(newPreset.id);
  };

  const loadPreset = (id: string) => {
    if (!id) {
      setSelectedPresetId('');
      return;
    }
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setFormData({ ...preset.params });
      setSelectedPresetId(id);
    }
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem('cc_presets', JSON.stringify(updatedPresets));
    if (selectedPresetId === id) setSelectedPresetId('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetSuggestions = async () => {
    if (!formData.topic.trim()) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const results = await generateTopicSuggestions(formData.topic);
      setSuggestions(results);
    } catch (error) {
      console.error("Failed to get suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, topic: suggestion }));
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-black rounded-xl sm:rounded-2xl shadow-xl border border-purple-900/30 p-4 sm:p-6 lg:p-8 h-full flex flex-col transition-all duration-300 text-gray-100 w-full overflow-hidden">
      
      {/* Header & Templates */}
      <div className="mb-4 sm:mb-6 border-b border-purple-900/20 pb-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 min-w-0">
            <span className="bg-gradient-to-br from-[#5E17EB] to-[#CB6CE6] p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </span>
            <span className="truncate">Create Content</span>
          </h2>
        </div>

        {/* Template Manager */}
        <div className="bg-black/60 rounded-lg p-2 flex flex-col gap-2 border border-purple-900/20 w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div className="relative flex-grow min-w-0">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex-shrink-0" />
              <select 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                value={selectedPresetId}
                onChange={(e) => loadPreset(e.target.value)}
              >
                <option value="">Load preset...</option>
                {presets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {selectedPresetId && (
              <button 
                onClick={(e) => deletePreset(selectedPresetId, e)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                title="Delete Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowSavePreset(!showSavePreset)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all flex-shrink-0 ${
                showSavePreset 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>

          {showSavePreset && (
            <div className="flex items-center gap-2 animate-fadeIn mt-1 w-full">
              <input 
                type="text" 
                placeholder="Template Name"
                className="flex-grow px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-0"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                autoFocus
              />
              <button 
                onClick={savePreset}
                disabled={!newPresetName.trim()}
                className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {/* Topic Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end gap-2 flex-wrap">
            <label className="block text-xs sm:text-sm font-semibold text-gray-200" htmlFor="topic">
              Topic or Subject <span className="text-[#5E17EB]">*</span>
            </label>
            {formData.topic.length > 3 && (
              <button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isSuggesting}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                <span className="hidden sm:inline">{isSuggesting ? 'Thinking...' : 'Get Ideas'}</span>
              </button>
            )}
          </div>
          <div className="relative group">
            <textarea
              id="topic"
              name="topic"
              required
              rows={2}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm text-sm"
              placeholder="e.g., The benefits of meditation for mental health"
              value={formData.topic}
              onChange={handleChange}
            />
          </div>
          
          {/* Suggestions Display */}
          {suggestions.length > 0 && (
            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wide">
                <Lightbulb className="w-3 h-3" />
                AI Suggestions
              </div>
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applySuggestion(suggestion)}
                    className="text-left text-sm text-gray-700 hover:text-indigo-700 bg-white hover:bg-indigo-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-200 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate mr-2">{suggestion}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Type & Tone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200" htmlFor="contentType">
              Content Type <span className="text-[#5E17EB]">*</span>
            </label>
            <div className="relative">
              <select
                id="contentType"
                name="contentType"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none"
                value={formData.contentType}
                onChange={handleChange}
              >
                {Object.values(ContentType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200" htmlFor="tone">
              Desired Tone <span className="text-[#5E17EB]">*</span>
            </label>
            <div className="relative">
              <select
                id="tone"
                name="tone"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none"
                value={formData.tone}
                onChange={handleChange}
              >
                {Object.values(Tone).map((tone) => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200" htmlFor="audience">
            Target Audience <span className="text-[#5E17EB]">*</span>
          </label>
          <input
            type="text"
            id="audience"
            name="audience"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            placeholder="e.g., Busy professionals aged 25-40"
            value={formData.audience}
            onChange={handleChange}
          />
        </div>

        {/* Word Count */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="wordCount">
            Length / Word Count
          </label>
          <input
            type="text"
            id="wordCount"
            name="wordCount"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            placeholder="e.g., 500 words, 2 minutes, 150 characters"
            value={formData.wordCount}
            onChange={handleChange}
          />
        </div>

        {/* Special Requirements */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="specialRequirements">
            Special Requirements / Keywords
          </label>
          <textarea
            id="specialRequirements"
            name="specialRequirements"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
            placeholder="e.g., Must include 'AI', 'productivity', Focus on cost-saving"
            value={formData.specialRequirements}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 sticky bottom-0 bg-black/80 pb-1 border-t border-purple-900/20">
          <button
            type="submit"
            disabled={isLoading || remainingCredits <= 0}
            className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all shadow-lg
              ${isLoading 
                ? 'bg-[#5E17EB]/60 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] hover:from-[#6a2ef0] hover:to-[#d07bf0] transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Crafting Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {remainingCredits > 0 ? 'Generate Content' : 'No Credits Left'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratorForm;
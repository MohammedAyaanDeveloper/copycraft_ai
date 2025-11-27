import React, { useState, useEffect } from 'react';
import { GenerationParams, ContentType, Tone, Preset } from '../types';
import { Sparkles, Loader2, Lightbulb, ArrowRight, Wand2, Bookmark, Save, Trash2, FolderOpen } from 'lucide-react';
import { generateTopicSuggestions } from '../services/geminiService';

interface GeneratorFormProps {
  isLoading: boolean;
  onSubmit: (params: GenerationParams) => Promise<void>;
  initialParams?: GenerationParams | null;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ isLoading, onSubmit, initialParams }) => {
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 h-full flex flex-col transition-all duration-300">
      
      {/* Header & Templates */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </span>
            Create Content
          </h2>
        </div>

        {/* Template Manager */}
        <div className="bg-slate-50 rounded-lg p-2 flex flex-col gap-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                value={selectedPresetId}
                onChange={(e) => loadPreset(e.target.value)}
              >
                <option value="">Load a template preset...</option>
                {presets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            {selectedPresetId && (
              <button 
                onClick={(e) => deletePreset(selectedPresetId, e)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Delete Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowSavePreset(!showSavePreset)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                showSavePreset 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>

          {showSavePreset && (
            <div className="flex items-center gap-2 animate-fadeIn mt-1">
              <input 
                type="text" 
                placeholder="Template Name (e.g., SEO Blog Post)"
                className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                autoFocus
              />
              <button 
                onClick={savePreset}
                disabled={!newPresetName.trim()}
                className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {/* Topic Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="topic">
              Topic or Subject <span className="text-indigo-500">*</span>
            </label>
            {formData.topic.length > 3 && (
              <button
                type="button"
                onClick={handleGetSuggestions}
                disabled={isSuggesting}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors disabled:opacity-50"
              >
                {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                {isSuggesting ? 'Thinking...' : 'Get Ideas'}
              </button>
            )}
          </div>
          <div className="relative group">
            <textarea
              id="topic"
              name="topic"
              required
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm"
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
            <label className="block text-sm font-semibold text-gray-700" htmlFor="contentType">
              Content Type <span className="text-indigo-500">*</span>
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
            <label className="block text-sm font-semibold text-gray-700" htmlFor="tone">
              Desired Tone <span className="text-indigo-500">*</span>
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
          <label className="block text-sm font-semibold text-gray-700" htmlFor="audience">
            Target Audience <span className="text-indigo-500">*</span>
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

        <div className="pt-4 sticky bottom-0 bg-white pb-1">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all shadow-lg shadow-indigo-200
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 transform hover:-translate-y-0.5 active:translate-y-0'
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
                Generate Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratorForm;
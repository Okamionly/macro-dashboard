import { useState } from "react";
import { useAnalysisNotes } from "../hooks/useAnalysisNotes";
import { Plus, Trash2, Archive, ArchiveRestore, X, Search } from "lucide-react";
import type { AnalysisNote } from "../lib/types";

const ASSETS = [
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "USDCHF", "NZDUSD",
  "XAUUSD", "XAGUSD", "BTCUSD", "SP500", "NASDAQ", "DOW", "VIX",
  "DXY", "OIL", "BRENT", "NATGAS", "CORN", "WHEAT", "SOYBEANS",
  "US10Y", "US2Y", "COPPER", "COFFEE", "COTTON", "SUGAR",
];

function NoteEditor({ note, onSave, onClose }: { note?: AnalysisNote; onSave: (data: Partial<AnalysisNote>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [asset, setAsset] = useState(note?.asset || "");
  const [bias, setBias] = useState<string>(note?.bias || "neutral");
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      asset: asset || null,
      bias: bias as "bullish" | "bearish" | "neutral",
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">{note ? "Modifier l'analyse" : "Nouvelle analyse"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'analyse"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-lg font-medium focus:border-blue-500 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <select value={asset} onChange={(e) => setAsset(e.target.value)} className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
              <option value="">Aucun asset</option>
              {ASSETS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="flex gap-2">
              {(["bullish", "bearish", "neutral"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBias(b)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    bias === b
                      ? b === "bullish" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                        : b === "bearish" ? "bg-rose-500/20 text-rose-400 border border-rose-500"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500"
                      : "border border-gray-700 text-gray-500"
                  }`}
                >
                  {b === "bullish" ? "🟢 Bull" : b === "bearish" ? "🔴 Bear" : "⚪ Neutre"}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Votre analyse..."
            rows={8}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none resize-none"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (séparés par des virgules)"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2"
          />
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition">Annuler</button>
            <button onClick={handleSave} className="flex-1 py-3 rounded-lg btn-primary text-white font-medium">
              {note ? "Sauvegarder" : "Créer l'analyse"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalysisNotes() {
  const { notes, addNote, updateNote, deleteNote, toggleArchive } = useAnalysisNotes();
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<AnalysisNote | undefined>();
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [biasFilter, setBiasFilter] = useState("all");

  const filtered = notes.filter((n) => {
    const matchArchive = showArchived ? n.is_archived : !n.is_archived;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()) || (n.asset || "").toLowerCase().includes(search.toLowerCase());
    const matchBias = biasFilter === "all" || n.bias === biasFilter;
    return matchArchive && matchSearch && matchBias;
  });

  const handleSave = (data: Partial<AnalysisNote>) => {
    if (editingNote) {
      updateNote(editingNote.id, data);
    } else {
      addNote(data as Omit<AnalysisNote, "id" | "created_at" | "updated_at" | "is_archived">);
    }
    setEditingNote(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Analyses</h1>
        <button
          onClick={() => { setEditingNote(undefined); setShowEditor(true); }}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nouvelle analyse
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm"
          />
        </div>
        <select value={biasFilter} onChange={(e) => setBiasFilter(e.target.value)} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="all">Tous bias</option>
          <option value="bullish">🟢 Bullish</option>
          <option value="bearish">🔴 Bearish</option>
          <option value="neutral">⚪ Neutral</option>
        </select>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition ${showArchived ? "bg-amber-500/20 text-amber-400" : "text-gray-400 hover:text-white"}`}
        >
          <Archive className="w-4 h-4" />
          {showArchived ? "Archivées" : "Actives"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-gray-500">{showArchived ? "Aucune analyse archivée" : "Aucune analyse. Créez votre première !"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <div key={note.id} className="glass rounded-2xl p-5 group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {note.asset && <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{note.asset}</span>}
                  {note.bias && (
                    <span className={`text-xs px-2 py-0.5 rounded bias-${note.bias}`}>
                      {note.bias === "bullish" ? "🟢 Bull" : note.bias === "bearish" ? "🔴 Bear" : "⚪ Neutre"}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => toggleArchive(note.id)} className="p-1 text-gray-400 hover:text-amber-400" title={note.is_archived ? "Désarchiver" : "Archiver"}>
                    {note.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { if (confirm("Supprimer cette analyse ?")) deleteNote(note.id); }} className="p-1 text-gray-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3
                className="text-lg font-bold mb-1 cursor-pointer hover:text-cyan-400 transition"
                onClick={() => { setEditingNote(note); setShowEditor(true); }}
              >
                {note.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-3">{note.content}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {note.tags?.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{tag}</span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(note.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditingNote(undefined); }}
        />
      )}
    </div>
  );
}

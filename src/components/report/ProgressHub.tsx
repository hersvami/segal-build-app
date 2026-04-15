import { useState } from 'react';
import type { Variation, Project } from '../../types/domain';

interface Props {
  variation: Variation;
  project: Project;
}

interface ProgressPhoto {
  id: string;
  url: string;
  caption: string;
  stage: string;
  date: string;
  aiAnalysis?: string;
}

interface ProgressUpdate {
  id: string;
  message: string;
  photoId?: string;
  channel: string;
  sentAt: string;
}

export function ProgressHub({ variation, project }: Props) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [newCaption, setNewCaption] = useState('');
  const [newStage, setNewStage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stageProgress, setStageProgress] = useState<Record<string, string>>({});

  const stages = variation.scopes?.flatMap(s =>
    s.stages.map(st => ({ name: st.name, trade: st.trade }))
  ) || variation.solutions?.[variation.selectedSolution || 0]?.stages?.map(st => ({
    name: st.name, trade: st.trade
  })) || [];

  const completedCount = Object.values(stageProgress).filter(s => s === 'complete').length;
  const inProgressCount = Object.values(stageProgress).filter(s => s === 'in-progress').length;
  const totalStages = stages.length;
  const progressPercent = totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (!previewUrl) return;
    const photo: ProgressPhoto = {
      id: Date.now().toString(),
      url: previewUrl,
      caption: newCaption,
      stage: newStage,
      date: new Date().toISOString(),
    };
    setPhotos(prev => [...prev, photo]);
    setPreviewUrl(null);
    setNewCaption('');
    setNewStage('');
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const cycleStageStatus = (stageName: string) => {
    setStageProgress(prev => {
      const current = prev[stageName] || 'not-started';
      const next = current === 'not-started' ? 'in-progress' : current === 'in-progress' ? 'complete' : 'not-started';
      return { ...prev, [stageName]: next };
    });
  };

  const generateUpdateMessage = () => {
    const customerName = project.customer?.name || 'there';
    const completedStages = stages.filter(s => stageProgress[s.name] === 'complete').map(s => s.name);
    const lastCompleted = completedStages[completedStages.length - 1];
    if (lastCompleted) {
      setUpdateMessage(`Hi ${customerName}, update on your ${project.name}: ${lastCompleted} is now complete! Overall progress: ${progressPercent}%.`);
    } else {
      setUpdateMessage(`Hi ${customerName}, update on your ${project.name}: Work is progressing well. Overall progress: ${progressPercent}%.`);
    }
  };

  const handleSendUpdate = (channel: string) => {
    if (!updateMessage) return;
    const update: ProgressUpdate = {
      id: Date.now().toString(),
      message: updateMessage,
      channel,
      sentAt: new Date().toISOString(),
    };
    setUpdates(prev => [...prev, update]);

    const encoded = encodeURIComponent(updateMessage);
    const phone = '0416460164';
    if (channel === 'sms') window.open(`sms:${phone}?body=${encoded}`);
    if (channel === 'whatsapp') window.open(`https://wa.me/61${phone.slice(1)}?text=${encoded}`);
    if (channel === 'email') window.open(`mailto:${project.customer?.email || ''}?subject=Progress Update - ${project.name}&body=${encoded}`);
    setUpdateMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Progress Photos */}
      <div>
        <h3 className="text-lg font-bold mb-4">📸 Progress Photos</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="mb-2" />
          {previewUrl && (
            <div className="space-y-2">
              <img src={previewUrl} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
              <input className="w-full border rounded p-2" placeholder="Caption..." value={newCaption} onChange={e => setNewCaption(e.target.value)} />
              <select className="w-full border rounded p-2" value={newStage} onChange={e => setNewStage(e.target.value)}>
                <option value="">Select stage...</option>
                {stages.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
              </select>
              <button onClick={handleAddPhoto} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Add Photo</button>
            </div>
          )}
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden border">
                <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {new Date(photo.date).toLocaleDateString()}
                </div>
                {photo.stage && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">{photo.stage}</div>
                )}
                <div className="p-2">
                  <p className="text-sm text-gray-700">{photo.caption}</p>
                </div>
                <button onClick={() => handleDeletePhoto(photo.id)} className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Stage Progress Tracker */}
      <div>
        <h3 className="text-lg font-bold mb-4">📊 Stage Progress Tracker</h3>
        <div className="bg-gray-100 rounded-full h-6 mb-4 overflow-hidden">
          <div className="bg-green-500 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-bold" style={{ width: `${progressPercent}%` }}>
            {progressPercent}%
          </div>
        </div>
        <div className="flex gap-4 mb-4 text-sm">
          <span className="text-green-600">✅ Complete: {completedCount}</span>
          <span className="text-amber-600">🔄 In Progress: {inProgressCount}</span>
          <span className="text-gray-400">⬜ Not Started: {totalStages - completedCount - inProgressCount}</span>
        </div>
        <div className="space-y-2">
          {stages.map((stage, idx) => {
            const status = stageProgress[stage.name] || 'not-started';
            return (
              <div key={idx} onClick={() => cycleStageStatus(stage.name)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${status === 'complete' ? 'bg-green-50 border-green-300' : status === 'in-progress' ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'}`}>
                <div>
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{stage.trade}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === 'complete' ? 'bg-green-200 text-green-800' : status === 'in-progress' ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>
                  {status === 'complete' ? '✅ Complete' : status === 'in-progress' ? '🔄 In Progress' : '⬜ Not Started'}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">Click a stage to cycle its status. Customer can see this progress.</p>
      </div>

      {/* Section 3: Progress Updates */}
      <div>
        <h3 className="text-lg font-bold mb-4">📢 Send Progress Update</h3>
        <button onClick={generateUpdateMessage} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg mb-2 hover:bg-indigo-200">
          🤖 Auto-generate message
        </button>
        <textarea className="w-full border rounded-lg p-3 mb-3" rows={3} value={updateMessage} onChange={e => setUpdateMessage(e.target.value)} placeholder="Write an update for the customer..." />
        <div className="flex gap-2">
          <button onClick={() => handleSendUpdate('sms')} className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">📱 SMS</button>
          <button onClick={() => handleSendUpdate('whatsapp')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">💬 WhatsApp</button>
          <button onClick={() => handleSendUpdate('email')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">📧 Email</button>
          <button onClick={() => { navigator.clipboard.writeText(updateMessage); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">📋 Copy</button>
        </div>

        {updates.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-500">Sent Updates</h4>
            {updates.map(u => (
              <div key={u.id} className="bg-gray-50 border rounded-lg p-3 text-sm">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{u.channel.toUpperCase()}</span>
                  <span>{new Date(u.sentAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700">{u.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
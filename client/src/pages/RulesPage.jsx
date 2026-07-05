import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X, Flag, RefreshCw, ListPlus, Loader2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/TableSkeleton';
import { createRule, fetchRules, updateRule, deleteRule } from '../api/rules.api';
import { fetchServers } from '../api/server.api';

// Unwraps common API response shapes ({ rule }, { data }, { response }, or bare object)
// so a differently-shaped response never silently becomes `undefined` and crashes render.
const unwrap = (res) => res?.rule || res?.data || res?.response || res;

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [serverId, setServerId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const [servers, setServers] = useState([]);

  const ruleToDelete = rules.find((r) => r.id === deleteConfirmId);

  const [formData, setFormData] = useState({
    keyword: '',
    action: '',
    priority: 0,
    isActive: true,
  });

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const data = await fetchServers();
      setServers(data.servers || data.response || data);
    } catch (err) {
      setError('Failed to load servers');
    }
  };

  const fetchRulesData = async (selectedServerId = '') => {
    try {
      setIsLoading(true);
      setError('');

      const data = await fetchRules(selectedServerId);

      setRules(Array.isArray(data) ? data : data.rules || data.response || []);
    } catch (err) {
      setError('Failed to load rules');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setFormData({ keyword: '', action: '', priority: 0, isActive: true });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      keyword: rule.keyword,
      action: rule.action,
      priority: rule.priority || 0,
      isActive: rule.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRule(null);
    setFormError('');
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-extra-light';

    
   const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
 
    if (!formData.keyword.trim() || !formData.action.trim()) {
      setFormError('Keyword and action are required.');
      return;
    }
 
    setIsSubmitting(true);
    try {
      if (editingRule) {
        const res = await updateRule(editingRule.id, formData);
        const updated = unwrap(res);
        setRules((prev) =>
          prev.map((r) => (String(r.id) === String(editingRule.id) ? { ...r, ...updated } : r))
        );
      } else {
        const res = await createRule(serverId, formData);
        const created = unwrap(res);
        if (created && created.id) {
          setRules((prev) => [...prev, created]);
        }
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save rule');
    } finally {
      setIsSubmitting(false);
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError('');
 
//     if (!formData.keyword.trim() || !formData.action.trim()) {
//       setFormError('Keyword and action are required.');
//       return;
//     }
 
//     setIsSubmitting(true);
//     try {
//       if (editingRule) {
//         const res = await updateRule(editingRule.id, formData);
//         const updated = unwrap(res);
//         console.log('unwrapped updatedRule:', updated);
//         setRules((prev) => {
//           const next = prev.map((r) =>
//             String(r.id) === String(editingRule.id) ? { ...r, ...updated } : r
//           );
//           console.log('matched row before:', prev.find((r) => String(r.id) === String(editingRule.id)));
//           console.log('matched row after:', next.find((r) => String(r.id) === String(editingRule.id)));
//           return next;
//         });
//       } else {
//         const res = await createRule(serverId, formData);
//         const created = unwrap(res);
//         if (created && created.id) {
//           setRules((prev) => [...prev, created]);
//         }
//       }
//       closeModal();
//     } catch (err) {
//       setFormError(err.response?.data?.message || 'Failed to save rule');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
 
  const handleToggleActive = async (rule) => {
    if (updatingIds.has(rule.id)) return; // ignore clicks while already saving

    setUpdatingIds((prev) => new Set(prev).add(rule.id));
    try {
      const res = await updateRule(rule.id, { isActive: !rule.isActive });
      const updated = unwrap(res);
      setRules((prev) =>
        prev.map((r) =>
          r.id === rule.id ? { ...r, isActive: updated?.isActive ?? !rule.isActive } : r
        )
      );
    } catch (err) {
      setError('Failed to update rule');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(rule.id);
        return next;
      });
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    console.log(id)
    try {
      await deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      setError('Failed to delete rule');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules</h1>
          <p className="mt-1 text-sm text-gray-500">Manage keyword rules for your bot</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchRulesData(serverId)}
            className="cursor-pointer ring-1 ring-black/5 shadow-md"
            variant="secondary"
            size="sm"
          >
            <RefreshCw className="h-4 w-6" />
          </Button>
          <Button onClick={openCreateModal} className="cursor-pointer ring-1 ring-black/5 shadow-md" size="sm">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </div>
      </div>

      <Card className="align-center mb-6 flex gap-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-600">Select Server</label>

        <select
          value={serverId}
          onChange={(e) => {
            const id = e.target.value;
            setServerId(id);

            if (id) {
              fetchRulesData(id);
            } else {
              setRules([]);
            }
          }}
          className="input rounded pl-4 pr-16 text-sm text-gray-500 outline-2 outline-primary bg-white"
        >
          <option className="text-sm" value="">
            No Selection
          </option>

          {servers.map((server) => (
            <option className="text-sm font-semibold text-gray-600" key={server.id} value={server.id}>
              {server.guildName}
            </option>
          ))}
        </select>
      </Card>

      {error && (
        <div className="text-sm text-red-500">
          <p className="text-error-700">{error}</p>
          <Button onClick={() => setError('')} variant="ghost" size="sm" className="mt-2">
            Dismiss
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : rules?.length === 0 ? (
        <EmptyState
          title="No rules yet"
          description={serverId ? 'Create your first rule for this server.' : 'Enter a server ID to view and manage rules.'}
          action={
            serverId && (
              <Button onClick={openCreateModal} size="sm">
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm transition-all duration-200 hover:shadow-md hover:ring-primary-light"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 transition-colors duration-200 ${
                  rule.isActive ? 'bg-primary' : 'bg-gray-200'
                }`}
              />

              <div className="flex items-start justify-between gap-2 pl-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{rule.keyword}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">{rule.action}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openEditModal(rule)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-extra-light hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(rule.id)}
                    className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pl-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-extra-light px-2.5 py-1 text-xs font-medium text-primary">
                  <Flag className="h-3 w-3" />
                  Priority {rule.priority}
                </span>

                <label className="flex cursor-pointer items-center gap-2">
                  <span className={`text-xs font-medium ${rule.isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleActive(rule)}
                    disabled={updatingIds.has(rule.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 disabled:cursor-wait disabled:opacity-60 ${
                      rule.isActive ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        rule.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {ruleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Delete rule</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete the rule for "{ruleToDelete.keyword}"? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(ruleToDelete.id)}
                disabled={deletingId === ruleToDelete.id}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
              >
                {deletingId === ruleToDelete.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-extra-light">
                <ListPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {editingRule ? 'Edit Rule' : 'Create Rule'}
                </h2>
                <p className="text-xs text-gray-500">
                  {editingRule ? "Update this rule's details." : 'Define a keyword trigger and its response.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Keyword</label>
                <input
                  type="text"
                  required
                  value={formData.keyword}
                  onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., !ping"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Action</label>
                <input
                  type="text"
                  required
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., reply, delete, mute"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Priority</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg bg-primary-extra-light/60 px-3 py-2.5">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    formData.isActive ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      formData.isActive ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {editingRule ? 'Save Changes' : 'Create Rule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
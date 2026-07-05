import React from 'react'

export default function Modal() {
  return (
    <>
    
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
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
                <h3 className="text-sm font-semibold text-gray-900">
                  Delete rule
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete the rule for "
                  {ruleToDelete.keyword}"? This cannot be undone.
                </p>
              </div>
            </div>
 
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg cursor-pointer border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(ruleToDelete.id)}
                className="rounded-lg cursor-pointer bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        </>
  )
}

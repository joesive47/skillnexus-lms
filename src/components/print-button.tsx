'use client'

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
    >
      🖨️ Print Certificate
    </button>
  )
}

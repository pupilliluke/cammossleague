export default function VisualBracket({ teams = [] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-center mb-2">CML Playoff Bracket</h3>
        <p className="text-center text-gray-600 text-sm">
          Complete Tournament Bracket
        </p>
      </div>
      
      {/* Embedded Playoff Bracket using iframe */}
      <div className="w-full overflow-x-auto">
        <iframe
          src="/cmlplayoffbracket.html"
          width="100%"
          height="800"
          style={{
            border: 'none',
            borderRadius: '8px',
            minHeight: '800px'
          }}
          title="CML Playoff Bracket"
        />
      </div>
    </div>
  )
}
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
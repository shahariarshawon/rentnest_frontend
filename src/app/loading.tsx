export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="absolute w-8 h-8 rounded-full border-4 border-emerald-100 border-b-emerald-500 animate-spin animate-reverse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading RentNest...</p>
    </div>
  );
}

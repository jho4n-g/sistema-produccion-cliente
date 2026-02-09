export default function FieldDetail({
  label,
  value,
  colSpan = 'md:col-span-6',
  className = '',
}) {
  return (
    <div className={`${colSpan} ${className}`}>
      <p className="text-xs font-bold text-slate-500">{label}</p>

      <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
        {value ?? '-'}
      </div>
    </div>
  );
}

export default function CheckboxField({
  label,
  name,
  checked = false,
  onChange,
  error,
}) {
  return (
    <div>
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          name={name}
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked, e)}
          className="h-4 w-4"
        />
        <span>{label}</span>
      </label>

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-600">
          {error[0] || error}
        </p>
      )}
    </div>
  );
}

export default function CheckboxField({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  className = '',
}) {
  return (
    <label
      className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 ${className}`}
    >
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, e)}
        className="h-4 w-4 rounded border-slate-300"
      />
      <span>{label}</span>
    </label>
  );
}

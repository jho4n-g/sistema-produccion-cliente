export default function EsmalteModal({ open, onClose, id, fetchById, onSave }) {
  console.log('EsmalteModal render:', { open, id });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-5xl rounded-2xl bg-white p-6 shadow-xl">
        Modal abierto: {id}
      </div>
    </div>
  );
}

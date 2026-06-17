"use client";

type AdviceModalProps = {
  isOpen: boolean;
  title: string;
  advice: string;
  onClose: () => void;
};

export function AdviceModal({ isOpen, title, advice, onClose }: AdviceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="advice-modal-title"
      >
        <h2 id="advice-modal-title" className="mb-3 text-lg font-semibold text-zinc-900">
          {title}
        </h2>
        <p className="mb-6 whitespace-pre-wrap text-base leading-relaxed text-zinc-700">
          {advice}
        </p>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}

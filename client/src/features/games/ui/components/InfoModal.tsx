import React, { memo } from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = memo(({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-[#1b1c1c]/50 backdrop-blur-[2px] animate-fadeIn select-none">
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 max-w-md w-full shadow-[8px_8px_0px_#1b1c1c] outline outline-4 outline-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#b61929] uppercase">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded border-2 border-[#1b1c1c] bg-[#eae7e7] hover:bg-[#e4e2e1] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center font-bold transition-all"
          >
            ✕
          </button>
        </div>

        <div className="font-['Rubik',sans-serif] text-sm text-[#1b1c1c] mb-6 space-y-3 leading-relaxed">
          {children}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full bg-[#ffe07e] hover:bg-[#ffd84d] text-[#231b00] py-2.5 border-2 border-[#1b1c1c] rounded-lg shadow-[3px_3px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold uppercase tracking-wider transition-all"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
});

InfoModal.displayName = "InfoModal";

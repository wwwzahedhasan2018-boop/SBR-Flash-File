import React from 'react';

interface BrandLogoProps {
  brandId: string;
  brandName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandId, brandName, className = '', size = 'md' }) => {
  const id = brandId.toLowerCase();

  switch (id) {
    case 'samsung':
      return (
        <div className={`flex items-center justify-center font-black tracking-widest text-[#1428A0] font-sans select-none ${className}`}>
          <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase font-sans">SAMSUNG</span>
        </div>
      );

    case 'xiaomi':
      return (
        <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
          <div className="bg-[#FF6900] text-white font-black rounded-lg w-7 h-7 flex items-center justify-center text-sm shadow-xs">
            mi
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-xl">Xiaomi</span>
        </div>
      );

    case 'vivo':
      return (
        <div className={`flex items-center justify-center font-extrabold text-[#005AC6] italic tracking-tight text-2xl select-none font-sans ${className}`}>
          vivo
        </div>
      );

    case 'oppo':
      return (
        <div className={`flex items-center justify-center font-black text-[#008B47] tracking-wider text-2xl select-none lowercase font-sans ${className}`}>
          oppo
        </div>
      );

    case 'realme':
      return (
        <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
          <span className="bg-[#FFC915] text-slate-950 font-black text-xs px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            R
          </span>
          <span className="font-extrabold text-slate-950 lowercase text-xl tracking-tight">realme</span>
        </div>
      );

    case 'apple':
      return (
        <div className={`flex items-center justify-center gap-2 text-slate-900 select-none ${className}`}>
          <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-5.78-8.8-10.15-18.73-13.1-29.78-2.95-11.06-4.43-21.84-4.43-32.34 0-14.34 3.47-26.35 10.42-36.03 6.95-9.68 15.82-14.61 26.61-14.78 4.58 0 9.77 1.25 15.57 3.75 5.79 2.5 9.78 3.79 11.96 3.87 1.63 0 5.77-1.33 12.42-3.99 6.64-2.65 12.3-3.83 16.98-3.53 13.06.77 23.36 5.48 30.91 14.13-11.51 6.97-17.16 16.63-16.95 28.98.22 9.69 4 17.84 11.36 24.45 7.35 6.62 16.14 10.35 26.35 11.19-2.61 8.27-5.98 16.51-10.1 24.71zM119.22 33.15c0-7.39 2.67-14.28 8.01-20.67 5.34-6.39 11.94-10.48 19.8-12.28.22 1.3.33 2.5.33 3.61 0 7.39-2.83 14.44-8.49 21.15-5.66 6.72-12.38 10.87-20.16 12.46-.33-1.41-.49-2.83-.49-4.27z"/>
          </svg>
          <span className="font-bold text-xl tracking-tight font-sans">Apple</span>
        </div>
      );

    case 'asus':
      return (
        <div className={`flex items-center justify-center font-black text-slate-950 tracking-widest text-2xl uppercase select-none ${className}`}>
          <span className="text-[#00539B] tracking-tight">ASUS</span>
        </div>
      );

    case 'alcatel':
      return (
        <div className={`flex items-center justify-center gap-1.5 font-bold select-none ${className}`}>
          <div className="w-6 h-6 rounded-full bg-[#00A3E0] flex items-center justify-center text-white text-xs font-black">
            a
          </div>
          <span className="font-black text-[#00A3E0] text-xl tracking-tight lowercase">alcatel</span>
        </div>
      );

    case 'advan':
      return (
        <div className={`flex items-center justify-center gap-1 font-black select-none ${className}`}>
          <span className="text-[#D32F2F] text-2xl tracking-tighter uppercase font-black">ADVAN</span>
          <span className="text-[10px] text-slate-400 font-bold self-start mt-0.5">®</span>
        </div>
      );

    case 'oneplus':
      return (
        <div className={`flex items-center justify-center gap-2 select-none ${className}`}>
          <div className="w-6 h-6 border-2 border-[#EB0028] text-[#EB0028] font-bold text-xs flex items-center justify-center rounded-xs">
            1+
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">ONEPLUS</span>
        </div>
      );

    case 'infinix':
      return (
        <div className={`flex items-center justify-center font-black text-slate-950 tracking-wider text-xl uppercase select-none ${className}`}>
          Infinix
        </div>
      );

    case 'tecno':
      return (
        <div className={`flex items-center justify-center font-black text-[#005CE6] tracking-widest text-xl uppercase select-none ${className}`}>
          TECNO
        </div>
      );

    case 'symphony':
      return (
        <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
          <div className="w-5 h-5 rounded-full bg-[#E21A22] flex items-center justify-center text-white text-[10px] font-black">
            S
          </div>
          <span className="font-black text-[#E21A22] tracking-normal text-lg uppercase">SYMPHONY</span>
        </div>
      );

    case 'walton':
      return (
        <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
          <div className="w-6 h-4 bg-[#00529B] rounded-xs flex items-center justify-center text-white text-[9px] font-black tracking-widest">
            W
          </div>
          <span className="font-extrabold text-[#00529B] tracking-wide text-xl uppercase">WALTON</span>
        </div>
      );

    case 'motorola':
      return (
        <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
          <div className="w-6 h-6 rounded-full bg-[#00142E] text-white font-serif font-black flex items-center justify-center text-sm">
            M
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">motorola</span>
        </div>
      );

    case 'nokia':
      return (
        <div className={`flex items-center justify-center font-black text-[#124191] tracking-widest text-xl uppercase select-none ${className}`}>
          NOKIA
        </div>
      );

    case 'itel':
      return (
        <div className={`flex items-center justify-center gap-1.5 font-bold select-none ${className}`}>
          <span className="bg-[#D32F2F] text-white px-2 py-0.5 rounded font-black text-sm tracking-wider">
            itel
          </span>
          <span className="text-slate-500 text-xs font-semibold">Mobile</span>
        </div>
      );

    default:
      return (
        <div className={`font-bold text-slate-800 text-lg uppercase tracking-wider select-none ${className}`}>
          {brandName || brandId}
        </div>
      );
  }
};

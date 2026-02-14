
import React from 'react';
import { Specialty } from '../types';

interface SpecialtyCardProps {
  specialty: Specialty;
  onClick: (specialty: Specialty) => void;
  isActive?: boolean;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, onClick, isActive }) => {
  return (
    <div 
      onClick={() => onClick(specialty)}
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden cursor-pointer group relative ${
        isActive ? 'ring-2 ring-emerald-500 border-transparent scale-[1.02]' : 'border-slate-200 hover:shadow-md hover:border-emerald-200'
      }`}
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={specialty.image} 
          alt={specialty.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
           <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 text-white p-3 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
             </svg>
           </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          {specialty.tags.map(tag => (
            <span key={tag} className="text-[10px] font-bold bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-slate-700 shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white relative">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 leading-tight flex-1">{specialty.name}</h3>
          <span className="text-emerald-500 group-hover:animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </span>
        </div>
        <p className="text-sm text-green-600 font-semibold italic mb-2">{specialty.vietnameseName}</p>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
          {specialty.description}
        </p>
        <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-700 flex items-center gap-1">
          Ask guide about this
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SpecialtyCard;

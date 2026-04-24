import { motion } from 'framer-motion';
import { User, GraduationCap, Trash2, Edit, Phone, Mail } from 'lucide-react';
import { Aluno, Professor } from '../interfaces';

interface Props {
    data: Aluno | Professor;
    type: 'aluno' | 'professor';
    onDelete?: (id: number) => void;
    onClickCard: (data: any) => void;
}

export const EntityCard = ({ data, type, onDelete, onClickCard }: Props) => {
    const isProf = type === 'professor';

    return (
        <motion.div
            onClick={() => onClickCard(data)}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden cursor-pointer bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border-t-4 transition-colors ${isProf ? 'border-purple-500' : 'border-cyan-500'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isProf ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'}`}>
                    {isProf ? <GraduationCap size={28} /> : <User size={28} />}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(data.id);
                        }} 
                        title="Excluir"
                        className="p-2 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-400 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{data.nome}</h3>
            
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Mail size={16} /> {data.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={16} /> {data.whatsapp}
                </div>
            </div>

            {isProf && (
                <div className="mt-4 inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-lg uppercase">
                    {(data as Professor).areaConhecimento}
                </div>
            )}
        </motion.div>
    );
};
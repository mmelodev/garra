import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }: Props) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col transition-colors border border-gray-100 dark:border-gray-700"
                    >
                        <div className="p-8 text-center pt-10">
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <AlertTriangle size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-3">{title}</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{message}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex gap-3 transition-colors">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Aguarde...' : 'Sim, excluir'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

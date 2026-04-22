import { createContext, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";

const PopupContext = createContext(null);

const popupStyles = {
  success: {
    icon: CheckCircle2,
    panel: "border-emerald-200 bg-emerald-50 text-emerald-900",
    badge: "bg-emerald-500 text-white",
  },
  error: {
    icon: XCircle,
    panel: "border-rose-200 bg-rose-50 text-rose-900",
    badge: "bg-rose-500 text-white",
  },
  warning: {
    icon: TriangleAlert,
    panel: "border-amber-200 bg-amber-50 text-amber-900",
    badge: "bg-amber-500 text-white",
  },
  info: {
    icon: Info,
    panel: "border-cyan-200 bg-cyan-50 text-cyan-900",
    badge: "bg-cyan-500 text-white",
  },
};

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const confirmResolverRef = useRef(null);
  const timeoutRef = useRef(null);

  const hidePopup = () => setPopup(null);

  const showPopup = ({ message, type = "info", duration = 3000 }) => {
    const id = Date.now();
    setPopup({ id, message, type });

    window.clearTimeout(timeoutRef.current);
    if (duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setPopup((current) => (current?.id === id ? null : current));
      }, duration);
    }
  };

  const confirm = ({ title = "Are you sure?", message = "", confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) =>
    new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmState({
        title,
        message,
        confirmText,
        cancelText,
        type,
      });
    });

  const closeConfirm = (result) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(result);
      confirmResolverRef.current = null;
    }
    setConfirmState(null);
  };

  const value = useMemo(
    () => ({
      showPopup,
      hidePopup,
      confirm,
    }),
    []
  );

  const appearance = popupStyles[popup?.type] || popupStyles.info;
  const PopupIcon = appearance.icon;
  const confirmAppearance = popupStyles[confirmState?.type] || popupStyles.warning;
  const ConfirmIcon = confirmAppearance.icon;

  return (
    <PopupContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 top-5 z-[9999] flex justify-center px-4"
          >
            <div
              className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${appearance.panel}`}
            >
              <div className={`rounded-xl p-2 ${appearance.badge}`}>
                <PopupIcon size={18} />
              </div>
              <p className="pt-1 text-sm font-medium">{popup.message}</p>
              <button
                type="button"
                onClick={hidePopup}
                className="ml-2 rounded-lg px-2 py-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              className="w-full max-w-md rounded-[28px] border border-white/20 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl p-3 ${confirmAppearance.badge}`}>
                  <ConfirmIcon size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">{confirmState.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{confirmState.message}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => closeConfirm(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {confirmState.cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => closeConfirm(true)}
                  className="rounded-2xl bg-slate-950 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                >
                  {confirmState.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used inside PopupProvider");
  }

  return context;
}

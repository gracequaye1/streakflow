export default function Footer() {
  return (
    <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40
                    bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-sm
                    border-t border-gray-100 dark:border-gray-800/50
                    py-2 text-center">
      <p className="text-xs text-gray-400 dark:text-gray-600">
        Made with{" "}
        <span className="text-red-400 animate-pulse">♥</span>
        {" "}by{" "}
        <span className="font-bold text-brand-500">The Duchess of Hackers</span>
      </p>
    </div>
  );
}

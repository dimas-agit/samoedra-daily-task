export default function Spinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[20px]">
      <div className="w-5 h-5 border-4 border-cyan-300 border-t-blue-600 rounded-full animate-spin"></div>
        {text && <p className="ml-4 text-gray-600">{text}</p>}
    </div>
  );
}
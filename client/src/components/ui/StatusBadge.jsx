const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-danger-100 text-danger-700',
  default: 'bg-gray-100 text-gray-700',
};

export default function StatusBadge({ children, variant = 'default' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variants[variant] || variants.default 
      }`}
    >
      {children}
    </span>
  );
}

export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full bg-gray-50 p-4 rounded-2xl ">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead className="bg-gray-200 text-primary">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="shadow-md">{children}</tbody>;
}

export function TableRow({ children, className = '' }) {
  return <tr className={`${className} text-left`}>{children}</tr>;
}

export function TableHeader({ children, className = '' }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-4 py-4 text-xs text-left ${className}`}>
      {children}
    </td>
  );
}

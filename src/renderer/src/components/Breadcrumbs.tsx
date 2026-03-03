import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1">
        {items.map((crumb, index) => (
          <li key={`${crumb.path}-${index}`} className="flex items-center gap-1">
            {index > 0 && <ChevronRightIcon size={16} className="text-gray-400 shrink-0" />}
            {index === items.length - 1 ? (
              <span className="text-base font-semibold text-blue-700">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

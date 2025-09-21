import { useUI } from '../contexts/UIContext';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  const { uiSettings } = useUI();

  if (!uiSettings.showHeader) {
    return null;
  }

  return (
    <div className="shadow-sm border-b px-4 py-4" style={{ 
      backgroundColor: 'var(--color-surface)', 
      borderColor: 'var(--color-border)' 
    }}>
      <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h1>
      {description && (
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  );
}

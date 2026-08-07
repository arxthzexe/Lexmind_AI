export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRiskColor(riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'): string {
  switch (riskLevel) {
    case 'Critical':
      return 'text-crimson-deep bg-crimson-light border-crimson-deep';
    case 'High':
      return 'text-crimson bg-crimson-light border-crimson';
    case 'Medium':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Low':
    default:
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  }
}

export function getStatusColor(status: 'Active' | 'Pending' | 'Expired' | 'Completed' | 'Review'): string {
  switch (status) {
    case 'Active':
    case 'Completed':
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'Pending':
    case 'Review':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'Expired':
      return 'text-crimson bg-crimson-light border-crimson';
    default:
      return 'text-slate-text bg-smoke border-gray-200';
  }
}

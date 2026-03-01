'use client'

import NextImage from 'next/image'
import { cn } from '@/src/lib/utils/utils'

// ── Button ─────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary', size = 'md', loading, children, className, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary:   'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-brand-sm hover:-translate-y-0.5 hover:shadow-brand-md focus-visible:ring-teal-500',
    secondary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-sm hover:-translate-y-0.5 hover:shadow-orange-md focus-visible:ring-orange-400',
    ghost:     'border-2 border-stone-200 text-stone-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 focus-visible:ring-teal-500',
    danger:    'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 focus-visible:ring-red-500',
  }
  const sizes = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-2.5 text-sm tracking-wider uppercase',
    lg: 'px-8 py-3.5 text-sm tracking-wider uppercase',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      )}
      {children}
    </button>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────
interface CardProps {
  children:  React.ReactNode
  className?: string
  hover?:    boolean
  padding?:  'sm' | 'md' | 'lg'
}

export function Card({ children, className, hover, padding = 'md' }: CardProps) {
  const pads = { sm: 'p-5', md: 'p-7', lg: 'p-9' }
  return (
    <div className={cn(
      'bg-white rounded-3xl border border-stone-100 shadow-sm',
      pads[padding],
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-brand-md cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children:  React.ReactNode
  color?:    'teal' | 'orange' | 'green' | 'red' | 'stone' | 'blue'
  className?: string
}

export function Badge({ children, color = 'teal', className }: BadgeProps) {
  const colors = {
    teal:   'bg-teal-50   text-teal-700  border-teal-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    green:  'bg-green-50  text-green-700  border-green-200',
    red:    'bg-red-50    text-red-700    border-red-200',
    stone:  'bg-stone-100 text-stone-600  border-stone-200',
    blue:   'bg-blue-50   text-blue-700   border-blue-200',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[0.72rem] font-bold',
      colors[color], className
    )}>
      {children}
    </span>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'animate-pulse bg-gradient-to-r from-stone-100 via-stone-200 to-stone-100',
      'bg-[length:200%_100%] animate-shimmer rounded-xl',
      className
    )} />
  )
}

export function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="h-5 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────────
interface AvatarProps {
  firstName?: string
  lastName?:  string
  src?:       string
  size?:      'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ firstName = '', lastName = '', src, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }
  const px    = { sm: 32, md: 40, lg: 56, xl: 80 }
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  if (src) {
    return (
      <NextImage
        src={src}
        alt={`${firstName} ${lastName}`}
        width={px[size]}
        height={px[size]}
        className={cn('rounded-full object-cover border-2 border-white shadow-sm', sizes[size], className)}
      />
    )
  }

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br from-teal-600 to-teal-700 text-white font-black flex items-center justify-center border-2 border-white shadow-sm',
      sizes[size], className
    )}>
      {initials || '?'}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon:       string
  title:      string
  description?: string
  action?:    React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl mb-5">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-stone-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-stone-400 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon:      string
  label:     string
  value:     string | number
  sub?:      string
  color?:    'teal' | 'orange' | 'green' | 'blue'
  className?: string
}

export function StatCard({ icon, label, value, sub, color = 'teal', className }: StatCardProps) {
  const colors = {
    teal:   'bg-teal-50   text-teal-600',
    orange: 'bg-orange-50 text-orange-600',
    green:  'bg-green-50  text-green-600',
    blue:   'bg-blue-50   text-blue-600',
  }
  return (
    <Card className={cn('flex items-start gap-4', className)}>
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0', colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-[0.75rem] font-bold uppercase tracking-wider text-stone-400 mb-0.5">{label}</p>
        <p className="font-display text-2xl font-black text-stone-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
      </div>
    </Card>
  )
}

export { cn }
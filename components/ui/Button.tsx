import { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  children: ReactNode
}

const base =
  "inline-flex items-center justify-center font-sans text-xs uppercase tracking-[0.12em] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"

const variants: Record<Variant, string> = {
  primary: "bg-[#1A1A18] text-[#FAFAF8] hover:bg-[#2C2C2A]",
  ghost: "text-[#1A1A18] hover:text-[#C9A96E] underline-offset-4 hover:underline",
  outline: "border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#FAFAF8]",
}

const sizes: Record<Size, string> = {
  sm: "h-8 px-4 text-[10px]",
  md: "h-11 px-6",
  lg: "h-13 px-8 text-[11px]",
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="opacity-60">Loading…</span> : children}
    </button>
  )
}

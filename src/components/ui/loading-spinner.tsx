"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "dots" | "pulse"
  className?: string
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full animate-pulse",
              size === "sm" ? "w-1 h-1" : 
              size === "md" ? "w-2 h-2" :
              size === "lg" ? "w-3 h-3" : "w-4 h-4"
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn(
        "rounded-full bg-primary/20 animate-pulse",
        sizeClasses[size],
        className
      )}>
        <div className={cn(
          "rounded-full bg-primary animate-ping",
          sizeClasses[size]
        )} />
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className={cn(
        "rounded-full animate-spin",
        sizeClasses[size],
        className
      )}>
        <div className="h-full w-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 p-1">
          <div className="h-full w-full rounded-full bg-background" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Glassmorphic base styles
const glassBase = "bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-lg text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 hover:bg-white/20 hover:shadow-xl"

const buttonVariants = cva(
  // Use glassmorphic as the base for all buttons
  `${glassBase} inline-flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap rounded-md text-xs sm:text-sm font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3 sm:[&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden`,
  {
    variants: {
      variant: {
        default: "",
        destructive: "bg-red-500/20 border-red-400/30 text-red-100 hover:bg-red-500/30",
        outline: "border border-white/30 bg-transparent text-white hover:bg-white/10",
        secondary: "bg-white/10 border-white/20 text-white hover:bg-white/20",
        ghost: "bg-transparent border-none text-white hover:bg-white/10",
        link: "bg-transparent border-none text-cyan-300 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 sm:h-10 px-3 sm:px-4 py-1.5 sm:py-2",
        sm: "h-7 sm:h-9 rounded-md px-2 sm:px-3 py-1 sm:py-1.5",
        lg: "h-9 sm:h-11 rounded-md px-6 sm:px-8 py-2 sm:py-2.5",
        icon: "h-8 w-8 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 0 1px #00fff7, 0 2px 12px #00fff733",
        }}
        whileTap={{ scale: 0.98 }}
        style={{ display: 'inline-block' }}
      >
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        >
          {/* Liquid shine effect */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 rounded-md" />
          </motion.div>
          {/* Button content */}
          <div className="relative z-10">
            {props.children}
          </div>
        </Comp>
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

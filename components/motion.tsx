"use client"

import { motion } from "framer-motion"
import React from "react"
import { MotionProps } from "framer-motion"

export const MotionDiv = motion.div
export const MotionH1 = motion.h1
export const MotionP = motion.p

export const MotionDivWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & MotionProps>((props, ref) => (
  <motion.div ref={ref} {...props} />
))
MotionDivWrapper.displayName = "MotionDivWrapper" 
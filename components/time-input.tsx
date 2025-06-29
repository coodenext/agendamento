"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  disabled?: boolean
}

export function TimeInput({ value, onChange, label, required = false, disabled = false }: TimeInputProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    onChange(timeValue)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="time-input">
        {label} {required && "*"}
      </Label>
      <Input
        id="time-input"
        type="time"
        value={value}
        onChange={handleTimeChange}
        min="08:00"
        max="20:00"
        step="1800" // 30 minutos
        disabled={disabled}
        required={required}
        className="w-full"
      />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { TimeInput } from "@/components/time-input"

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

interface Barber {
  id: string
  name: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function AgendarPage() {
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedService, setSelectedService] = useState("")
  const [selectedBarber, setSelectedBarber] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [manualTime, setManualTime] = useState("")
  const [useManualTime, setUseManualTime] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadServices()
    loadBarbers()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots()
    }
  }, [selectedDate, selectedBarber])

  const loadServices = async () => {
    const { data } = await supabase.from("services").select("*").eq("active", true).order("name")

    if (data) setServices(data)
  }

  const loadBarbers = async () => {
    const { data } = await supabase.from("barbers").select("*").eq("active", true).order("name")

    if (data) setBarbers(data)
  }

  const generateTimeSlots = async () => {
    if (!selectedDate) return

    const slots: TimeSlot[] = []
    const startHour = 8
    const endHour = 20
    const interval = 30 // minutos

    // Buscar agendamentos existentes para a data
    const { data: bookings } = await supabase
      .from("bookings")
      .select("time, barber_id")
      .eq("date", selectedDate.toISOString().split("T")[0])
      .in("status", ["confirmed", "pending"])

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        // Verificar se o horário está ocupado
        const isBooked = bookings?.some(
          (booking) => booking.time === time && (selectedBarber === "" || booking.barber_id === selectedBarber),
        )

        // Verificar se é um horário passado APENAS se for hoje
        const now = new Date()
        const isToday = selectedDate.toDateString() === now.toDateString()
        let isPastTime = false

        if (isToday) {
          const currentHour = now.getHours()
          const currentMinute = now.getMinutes()
          const slotHour = Number.parseInt(time.split(":")[0])
          const slotMinute = Number.parseInt(time.split(":")[1])

          // Só considera passado se for hoje E o horário já passou
          isPastTime = slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)
        }

        slots.push({
          time,
          available: !isBooked && !isPastTime,
        })
      }
    }

    setTimeSlots(slots)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalTime = useManualTime ? manualTime : selectedTime
    if (!selectedService || !selectedDate || !finalTime || !clientName || !clientPhone) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Verificar se o horário manual está dentro do funcionamento
    if (useManualTime) {
      const [hours, minutes] = manualTime.split(":").map(Number)
      if (hours < 8 || hours >= 20) {
        alert("Horário deve ser entre 08:00 e 20:00")
        return
      }
    }

    // Verificar se o horário já está ocupado
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", selectedDate.toISOString().split("T")[0])
      .eq("time", finalTime)
      .eq("barber_id", selectedBarber || null)
      .in("status", ["confirmed", "pending"])
      .single()

    if (existingBooking) {
      alert("Este horário já está ocupado. Escolha outro horário.")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("bookings").insert({
        service_id: selectedService,
        barber_id: selectedBarber || null,
        date: selectedDate.toISOString().split("T")[0],
        time: finalTime,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail || null,
        status: "pending",
      })

      if (error) throw error

      setShowSuccess(true)
      // Reset form
      setSelectedService("")
      setSelectedBarber("")
      setSelectedDate(undefined)
      setSelectedTime("")
      setClientName("")
      setClientPhone("")
      setClientEmail("")
      setManualTime("")
      setUseManualTime(false)
    } catch (error) {
      console.error("Erro ao agendar:", error)
      alert("Erro ao realizar agendamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Agendamento Realizado!</CardTitle>
            <CardDescription>
              Seu agendamento foi enviado com sucesso. Entraremos em contato para confirmação.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button className="w-full">Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Agendar Horário</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
            <CardDescription>Preencha os dados abaixo para agendar seu horário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Serviço */}
              <div className="space-y-2">
                <Label htmlFor="service">Serviço *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - R$ {service.price.toFixed(2)} ({service.duration}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Barbeiro */}
              <div className="space-y-2">
                <Label htmlFor="barber">Barbeiro (opcional)</Label>
                <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer barbeiro disponível" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbers.map((barber) => (
                      <SelectItem key={barber.id} value={barber.id}>
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full"
                  required
                />
              </div>

              {/* Horário */}
              {selectedDate && !useManualTime && (
                <div className="space-y-2">
                  <Label>Horário Disponível *</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`text-sm ${
                          !slot.available
                            ? "opacity-50 cursor-not-allowed bg-red-50 border-red-200 text-red-400"
                            : slot.available && selectedTime !== slot.time
                              ? "hover:bg-green-50 hover:border-green-200"
                              : ""
                        }`}
                      >
                        {slot.time}
                        {!slot.available && <span className="ml-1 text-xs">✗</span>}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">✗ = Horário ocupado | Clique nos horários disponíveis</p>
                </div>
              )}

              {/* Horário Manual (alternativa) */}
              {selectedDate && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manual-time"
                      checked={useManualTime}
                      onChange={(e) => {
                        setUseManualTime(e.target.checked)
                        if (!e.target.checked) {
                          setManualTime("")
                        } else {
                          setSelectedTime("")
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="manual-time" className="text-sm">
                      Ou digite um horário específico
                    </Label>
                  </div>

                  {useManualTime && (
                    <TimeInput value={manualTime} onChange={setManualTime} label="Horário desejado" required />
                  )}
                </div>
              )}

              {/* Dados do Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seus Dados</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(87) 992437345"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Phone, Mail, Check, X, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  date: string
  time: string
  client_name: string
  client_phone: string
  client_email?: string
  status: "pending" | "confirmed" | "cancelled"
  services: { name: string; price: number }
  barbers?: { name: string }
}

interface Service {
  id: string
  name: string
  price: number
  duration: number
  active: boolean
}

interface Barber {
  id: string
  name: string
  active: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))

  // Formulários
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" })
  const [newBarber, setNewBarber] = useState({ name: "" })

  const { toast } = useToast()

  const supabase = createClient()

  const handleLogin = () => {
    // Senha simples para demonstração - em produção, use autenticação adequada
    if (password === "admin123") {
      setIsAuthenticated(true)
      loadData()
    } else {
      alert("Senha incorreta!")
    }
  }

  const loadData = async () => {
    await Promise.all([loadBookings(), loadServices(), loadBarbers()])
  }

  const loadBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select(`
        *,
        services (name, price),
        barbers (name)
      `)
      .eq("date", selectedDate)
      .order("time")

    if (data) setBookings(data)
  }

  const loadServices = async () => {
    const { data } = await supabase.from("services").select("*").order("name")

    if (data) setServices(data)
  }

  const loadBarbers = async () => {
    const { data } = await supabase.from("barbers").select("*").order("name")

    if (data) setBarbers(data)
  }

  const sendWhatsAppConfirmation = (booking: Booking) => {
    const phone = booking.client_phone.replace(/\D/g, "") // Remove caracteres não numéricos
    const formattedPhone = phone.startsWith("55") ? phone : `55${phone}` // Adiciona código do Brasil se necessário

    const message = `Olá! Seu horário foi confirmado com sucesso.
Muito obrigado pela preferência! ✂️`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, "_blank")
  }

  const updateBookingStatus = async (bookingId: string, status: "confirmed" | "cancelled") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)

    if (!error) {
      if (status === "confirmed") {
        // Apenas mostrar notificação de sucesso, sem abrir WhatsApp
        toast({
          title: "Agendamento confirmado!",
          description: "O agendamento foi confirmado com sucesso.",
        })
      } else if (status === "cancelled") {
        toast({
          title: "Agendamento cancelado",
          description: "O agendamento foi cancelado com sucesso.",
          variant: "destructive",
        })
      }

      loadBookings()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      })
    }
  }

  const addService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newService.name || !newService.price || !newService.duration) return

    const { error } = await supabase.from("services").insert({
      name: newService.name,
      price: Number.parseFloat(newService.price),
      duration: Number.parseInt(newService.duration),
      active: true,
    })

    if (!error) {
      setNewService({ name: "", price: "", duration: "" })
      loadServices()
    }
  }

  const addBarber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBarber.name) return

    const { error } = await supabase.from("barbers").insert({
      name: newBarber.name,
      active: true,
    })

    if (!error) {
      setNewBarber({ name: "" })
      loadBarbers()
    }
  }

  const toggleServiceStatus = async (serviceId: string, active: boolean) => {
    const { error } = await supabase.from("services").update({ active }).eq("id", serviceId)

    if (!error) {
      loadServices()
    }
  }

  const toggleBarberStatus = async (barberId: string, active: boolean) => {
    const { error } = await supabase.from("barbers").update({ active }).eq("id", barberId)

    if (!error) {
      loadBarbers()
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings()
    }
  }, [selectedDate, isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription>Digite a senha para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Digite a senha"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Entrar
              </Button>
              <p className="text-sm text-slate-500 text-center">Senha de demonstração: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
          <Button variant="outline" size="sm" onClick={() => setIsAuthenticated(false)} className="text-slate-900">
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="barbers">Barbeiros</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos do Dia</CardTitle>
                <div className="flex items-center gap-4">
                  <Label htmlFor="date">Data:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhum agendamento para esta data.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{booking.time}</span>
                                <Badge
                                  variant={
                                    booking.status === "confirmed"
                                      ? "default"
                                      : booking.status === "pending"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {booking.status === "confirmed"
                                    ? "Confirmado"
                                    : booking.status === "pending"
                                      ? "Pendente"
                                      : "Cancelado"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{booking.client_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{booking.client_phone}</span>
                              </div>
                              {booking.client_email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{booking.client_email}</span>
                                </div>
                              )}
                              <div className="text-sm text-slate-600">
                                <p>
                                  Serviço: {booking.services.name} - R$ {booking.services.price.toFixed(2)}
                                </p>
                                {booking.barbers && <p>Barbeiro: {booking.barbers.name}</p>}
                              </div>
                            </div>
                            {booking.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirmar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </div>
                            )}
                            {booking.status === "confirmed" && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => sendWhatsAppConfirmation(booking)}>
                                  📱 Enviar WhatsApp
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addService} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceName">Nome do Serviço</Label>
                      <Input
                        id="serviceName"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="Ex: Corte Masculino"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servicePrice">Preço (R$)</Label>
                      <Input
                        id="servicePrice"
                        type="number"
                        step="0.01"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        placeholder="25.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceDuration">Duração (min)</Label>
                      <Input
                        id="serviceDuration"
                        type="number"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviços Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-slate-600">
                          R$ {service.price.toFixed(2)} - {service.duration} minutos
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleServiceStatus(service.id, !service.active)}
                        >
                          {service.active ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="barbers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Barbeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addBarber} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="barberName">Nome do Barbeiro</Label>
                    <Input
                      id="barberName"
                      value={newBarber.name}
                      onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
                      placeholder="Ex: João Silva"
                      required
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Barbeiro
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Barbeiros Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {barbers.map((barber) => (
                    <div key={barber.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{barber.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={barber.active ? "default" : "secondary"}>
                          {barber.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBarberStatus(barber.id, !barber.active)}
                        >
                          {barber.active ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

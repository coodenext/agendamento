import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Phone, Scissors, Star } from "lucide-react"

export default function HomePage() {
  const services = [
    { name: "Corte Masculino", price: "R$ 25,00", duration: "30 min" },
    { name: "Barba", price: "R$ 20,00", duration: "20 min" },
    { name: "Combo (Corte + Barba)", price: "R$ 40,00", duration: "45 min" },
    { name: "Sobrancelha", price: "R$ 15,00", duration: "15 min" },
  ]

  const barbers = [
    { name: "João Silva", experience: "5 anos", specialty: "Cortes clássicos" },
    { name: "Pedro Santos", experience: "3 anos", specialty: "Barbas e bigodes" },
    { name: "Carlos Lima", experience: "7 anos", specialty: "Cortes modernos" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6" />
            <h1 className="text-xl font-bold">Barbearia Clássica</h1>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="text-slate-900 bg-transparent">
              Painel Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Bem-vindo à Barbearia Clássica</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Tradição e qualidade em cada corte. Agende seu horário online e tenha a melhor experiência em cuidados
            masculinos.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
              Agendar Horário
            </Button>
          </Link>
        </div>
      </section>

      {/* Informações da Barbearia */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Rua das Flores, 123
                  <br />
                  Centro - São Paulo, SP
                  <br />
                  CEP: 01234-567
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 16h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <p>Telefone: (11) 9999-9999</p>
                  <p>WhatsApp: (11) 9999-9999</p>
                  <p>Email: contato@barbeariaclassica.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Nossos Serviços</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-900">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Barbeiros */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Nossa Equipe</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {barbers.map((barber, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{barber.name}</CardTitle>
                  <CardDescription>Experiência: {barber.experience}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Especialidade: {barber.specialty}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="h-6 w-6" />
            <h4 className="text-xl font-bold">Barbearia Clássica</h4>
          </div>
          <p className="text-slate-400">© 2024 Barbearia Clássica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

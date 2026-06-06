'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CompletarPerfilPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      addressLine1: formData.get('addressLine1') as string,
      addressLine2: formData.get('addressLine2') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      postalCode: formData.get('postalCode') as string,
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar perfil')
      }

      // Redirigir a la tienda
      router.push('/tienda')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg p-8 border">
          <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">
            Completa tu perfil
          </h1>
          <p className="text-stone-600 text-center mb-6">
            Para continuar, necesitamos algunos datos más
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2"
                placeholder="Tus apellidos"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2"
                placeholder="+34 600 000 000"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-stone-900 mb-3">Dirección *</h3>

              <div className="space-y-3">
                <input
                  type="text"
                  name="addressLine1"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2"
                  placeholder="Calle y número"
                />

                <input
                  type="text"
                  name="addressLine2"
                  className="w-full border border-stone-300 rounded-md px-3 py-2"
                  placeholder="Piso, puerta (opcional)"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2"
                    placeholder="Ciudad"
                  />

                  <input
                    type="text"
                    name="province"
                    required
                    className="w-full border border-stone-300 rounded-md px-3 py-2"
                    placeholder="Provincia"
                  />
                </div>

                <input
                  type="text"
                  name="postalCode"
                  required
                  className="w-full border border-stone-300 rounded-md px-3 py-2"
                  placeholder="Código postal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar y continuar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

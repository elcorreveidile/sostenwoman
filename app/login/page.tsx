'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const result = await signIn('email', {
        email,
        callbackUrl: `${window.location.origin}`,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Error al enviar magic link')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar magic link')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg p-8 border">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">¡Email enviado!</h2>
            <p className="text-stone-600 mb-6">
              Hemos enviado un magic link a tu correo. Haz click en el enlace para acceder.
            </p>
            <p className="text-sm text-stone-500">
              Revisa tu bandeja de entrada y spam.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg p-8 border">
          <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">
            Acceder a SostenWoman
          </h1>
          <p className="text-stone-600 text-center mb-6">
            Introduce tu email y te enviaremos un magic link para acceder
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border border-stone-300 rounded-md px-3 py-2"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Magic Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/tienda" className="text-sm text-stone-600 hover:text-stone-900">
              ← Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

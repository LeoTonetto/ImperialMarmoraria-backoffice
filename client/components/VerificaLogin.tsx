'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectPageOptions {
  requireAdmin?: boolean
}

/**
 * Hook que protege páginas privadas.
 * - Verifica se há token no localStorage
 * - Valida o token na API
 * - Se `requireAdmin` for true, valida o role
 */
export function useProtectPage({ requireAdmin = false }: ProtectPageOptions = {}) {
  const router = useRouter()

  useEffect(() => {
    async function verifyAccess() {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      // 🔒 Sem token → redireciona pro login
      if (!token) {
        alert('Você precisa estar logado.')
        router.push('/login')
        return
      }

      try {
        // 🔍 Valida token na API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Home`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })

        if (!response.ok) {
          throw new Error('Acesso não autorizado')
        }

        // 🧑‍💼 Se precisa ser admin
        if (requireAdmin && role !== 'administrator') {
          alert('Acesso restrito a administradores.')
          router.push('/backoffice')
          return
        }

        // ✅ Tudo certo — continua na página
      } catch (error) {
        console.error(error)
        alert('Sessão inválida ou expirada.')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        router.push('/login')
      }
    }

    verifyAccess()
  }, [router, requireAdmin])
}
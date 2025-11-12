'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectPageOptions {
  requireAdmin?: boolean
}

export function useProtectPage({ requireAdmin = false }: ProtectPageOptions = {}) {
  const router = useRouter()

  useEffect(() => {
    async function verifyAccess() {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      if (!token) {
        alert('Você precisa estar logado.')
        window.location.href = "https://localhost:7237/login";
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Home`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })

    console.log('Response:', response.status, await response.text());

        if (!response.ok) {
          throw new Error('Acesso não autorizado')
        }

        if (requireAdmin && role !== 'administrator') {
          alert('Acesso restrito a administradores.')
          router.push('/')
          return
        }

      } catch (error) {
        console.error(error)
        alert('Sessão inválida ou expirada.')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        window.location.href = "https://localhost:7237/login";
      }
    }

    verifyAccess()
  }, [router, requireAdmin])
}
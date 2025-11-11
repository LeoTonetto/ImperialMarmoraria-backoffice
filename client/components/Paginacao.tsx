'use client';

import React from 'react';

interface PaginationProps {
  totalPaginas: number;
  paginaAtual: number;
  onChange: (pagina: number) => void;
}

export default function Pagination({ totalPaginas, paginaAtual, onChange }: PaginationProps) {
  if (totalPaginas <= 1) return null; // não mostra se só tiver 1 página

  return (
    <div className="table-pages">
      {Array.from({ length: totalPaginas }, (_, i) => (
        <div
          key={i}
          className={i === paginaAtual ? 'active' : ''}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

/* 
import { useProtectPage } from '@/utils/protectPage'

export default function FuncionariosPage() {
  useProtectPage({ requireAdmin: true }) // exige role = administrator

  return <h1>Página de Funcionários (Admin)</h1>
} */
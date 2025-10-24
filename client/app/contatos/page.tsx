'use client';

import React, { useEffect, useState } from 'react';
import { GetOrcamentos, Orcamento } from '../../components/ApiOrcamentos';
import Pagination from '../../components/Paginacao';

export default function ContatosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(0);
  const itensPorPagina = 10;

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetOrcamentos();
      if (result?.orcamentos) {
        // Ordena alfabeticamente por nome
        const ordenados = result.orcamentos.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setOrcamentos(ordenados);
      }
    };
    fetchData();
  }, []);

  // Paginação
  const totalPaginas = Math.ceil(orcamentos.length / itensPorPagina);
  const inicio = paginaAtual * itensPorPagina;
  const fim = Math.min(inicio + itensPorPagina, orcamentos.length);
  const orcamentosPagina = orcamentos.slice(inicio, fim);

  return (
    <main>
      <div className="contatos-table">
        <div>
          <p><strong>Nome</strong></p>
          <p><strong>Email</strong></p>
          <p><strong>Telefone</strong></p>
        </div>

        <div className="table-hover">
          <div className="table-contatos">
            {orcamentosPagina.length > 0 ? (
              orcamentosPagina.map((orc, index) => (
                <div
                  key={orc.id}
                  className={`flex cursor-pointer hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <p>{orc.nome}</p>
                  <p>{orc.email}</p>
                  <p>{orc.celular || orc.celular}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Nenhum orçamento encontrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Paginação */}
      <Pagination
        totalPaginas={totalPaginas}
        paginaAtual={paginaAtual}
        onChange={setPaginaAtual}
       />
    </main>
  );
}

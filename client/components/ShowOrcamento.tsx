'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import ShowOrcamentos  from './TableOrcamentos';
import { GetOrcamentos, Orcamento } from './ApiOrcamentos';

const itensPorPagina = 10;

const OrcamentosTable: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [filtroStatus, setFiltroStatus] = useState<string>('all');
  const [pesquisaNome, setPesquisaNome] = useState<string>('');

  // Busca inicial
  useEffect(() => {
    const fetchData = async () => {
      const result = await GetOrcamentos();
      setOrcamentos(result?.orcamentos || []);
    };
    fetchData();
  }, []);

  // Filtro por status
  const handleFiltroChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setFiltroStatus(status);
    setPaginaAtual(1);

    const result =
      status === 'all'
        ? await GetOrcamentos()
        : await GetOrcamentos({ status });

    setOrcamentos(result?.orcamentos || []);
  };

  // Pesquisa por nome
  const handlePesquisaChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setPesquisaNome(nome);
    setPaginaAtual(1);

    const result =
      !nome
        ? await GetOrcamentos()
        : await GetOrcamentos({ name: nome });

    setOrcamentos(result?.orcamentos || []);
  };

  // Calcula itens da página atual
  const totalPaginas = Math.ceil(orcamentos.length / itensPorPagina);
  const orcamentosPaginaAtual = orcamentos.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Pesquisar por nome..."
          value={pesquisaNome}
          onChange={handlePesquisaChange}
          className="border rounded px-2 py-1"
        />
        <select
          value={filtroStatus}
          onChange={handleFiltroChange}
          className="border rounded px-2 py-1"
        >
          <option value="all">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="fechado">Fechado</option>
        </select>
      </div>

      {/* Tabela */}
        <ShowOrcamentos orcamentos={orcamentosPaginaAtual} paginaAtual={paginaAtual} />

      {/* Paginação */}
      <div className="flex gap-2">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${num === paginaAtual ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setPaginaAtual(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrcamentosTable;

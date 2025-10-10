"use client";

import React, { useState, useEffect } from "react";

export interface Orcamento {
  id: number;
  nome: string;
  email: string;
  celular: string;
  valor: number;
  status: number;
  dataInicio: string;
  dataFim?: string | null;
  descricao: string;
}

interface Props {
  orcamentos: Orcamento[];
  paginaAtual?: number; // ← agora é opcional
}

export default function ShowOrcamentos({ orcamentos, paginaAtual = 1 }: Props) {
  const itensPorPagina = 10;
  const [lista, setLista] = useState<Orcamento[]>([]);

  useEffect(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = Math.min(inicio + itensPorPagina, orcamentos.length);
    setLista(orcamentos.slice(inicio, fim));
  }, [orcamentos, paginaAtual]);

  const formataData = (data?: string | null): string => {
    if (!data) return "";
    const [year, month, day] = data.split("-");
    return `${day}/${month}/${year}`;
  };

  const formataValor = (valor: number): string =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formataStatus = (status: number): string => {
    switch (status) {
      case 0:
        return "Novo";
      case 1:
        return "Em andamento";
      default:
        return "Finalizado";
    }
  };

  const handleDelete = async (id: number) => {
    console.log("Excluir orçamento", id);
    setLista((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = async (id: number, status: number) => {
    console.log("Atualizar orçamento", id, status);
    // aqui você pode adicionar a lógica de atualização real depois
  };

  if (!lista.length) {
    return <p className="text-gray-500 text-center mt-4">Nenhum orçamento nesta página.</p>;
  }

  return (
    <div className="space-y-4">
      {lista.map((orc) => (
        <div key={orc.id} className="rounded-lg overflow-hidden shadow-md bg-white">
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-300 text-sm font-medium text-gray-800">
            <p>{orc.id}</p>
            <p>{orc.nome}</p>
            <p>{formataData(orc.dataInicio)}</p>
            <p>{formataStatus(orc.status)}</p>
            <p>{formataValor(orc.valor)}</p>
            <p>{formataData(orc.dataFim)}</p>
          </div>

          <form className="p-4 space-y-4 text-sm bg-gray-50">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Nome completo:</label>
                <input type="text" value={orc.nome} readOnly className="w-full border rounded p-1 bg-white" />
              </div>

              <div>
                <label className="block font-semibold">Email:</label>
                <input type="text" value={orc.email} readOnly className="w-full border rounded p-1 bg-white" />
              </div>

              <div>
                <label className="block font-semibold">Telefone:</label>
                <input type="text" value={orc.celular} readOnly className="w-full border rounded p-1 bg-white" />
              </div>

              <div>
                <label className="block font-semibold">Orçamento:</label>
                <input
                  type="text"
                  value={formataValor(orc.valor)}
                  readOnly
                  className="w-full border rounded p-1 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold">Status:</label>
                <input
                  type="text"
                  value={formataStatus(orc.status)}
                  readOnly
                  className="w-full border rounded p-1 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold">Data de Entrada:</label>
                <input
                  type="text"
                  value={formataData(orc.dataInicio)}
                  readOnly
                  className="w-full border rounded p-1 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold">Data de Finalização:</label>
                <input
                  type="text"
                  value={formataData(orc.dataFim)}
                  readOnly
                  className="w-full border rounded p-1 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold">Descrição:</label>
              <textarea
                readOnly
                className="w-full border rounded p-1 bg-white min-h-[80px]"
                value={orc.descricao}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDelete(orc.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>

              <button
                type="button"
                onClick={() => handleUpdate(orc.id, orc.status)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}

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
  paginaAtual?: number;
}

export default function ShowOrcamentos({ orcamentos }: Props) {
  const formataData = (data?: string | null) => {
    if (!data) return "";
    const [year, month, day] = data.split("-");
    return `${day}/${month}/${year}`;
  };

  const formataValor = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formataStatus = (status: number) => {
    switch (status) {
      case 0: return "Novo";
      case 1: return "Em andamento";
      default: return "Finalizado";
    }
  };

  if (!orcamentos.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        Nenhum orçamento encontrado.
      </div>
    );
  }

  return (
    <div className="table-fill w-full">
      {/* Cabeçalho */}
      <div className="table-header flex bg-gray-100 font-semibold">
        <div className="table-cell flex-1 px-4 py-2">ID</div>
        <div className="table-cell flex-1 px-4 py-2">Nome</div>
        <div className="table-cell flex-1 px-4 py-2">Data Entrada</div>
        <div className="table-cell flex-1 px-4 py-2">Status</div>
        <div className="table-cell flex-1 px-4 py-2">Valor</div>
        <div className="table-cell flex-1 px-4 py-2">Data Finalizado</div>
      </div>

      {/* Linhas */}
      <div className="">
        {orcamentos.map((orc) => (
          <div
            key={orc.id}
            className="flex hover:bg-gray-100 w-full"
          >
            <div className="table-cell flex-1 px-4 py-2">{orc.id}</div>
            <div className="table-cell flex-1 px-4 py-2">{orc.nome}</div>
            <div className="table-cell flex-1 px-4 py-2">{formataData(orc.dataInicio)}</div>
            <div className="table-cell flex-1 px-4 py-2">{formataStatus(orc.status)}</div>
            <div className="table-cell flex-1 px-4 py-2">{formataValor(orc.valor)}</div>
            <div className="table-cell flex-1 px-4 py-2">{formataData(orc.dataFim)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


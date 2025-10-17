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
      <div className="table-header flex bg-gray-100 font-semibold items-center">
        <div className="table-cell flex-1 px-4 py-2 text-center ">ID</div>
        <div className="table-cell flex-8 px-4 py-2 text-center">Nome</div>
        <div className="table-cell flex-3 px-4 py-2 text-center">Data Entrada</div>
        <div className="table-cell flex-2 px-4 py-2 text-center">Status</div>
        <div className="table-cell flex-2 px-4 py-2 text-center">Valor</div>
        <div className="table-cell flex-3 px-4 py-2 text-center">Data Finalizado</div>
      </div>

      {/* Linhas */}
      <div className="">
        {orcamentos.map((orc, index) => (
          <div
            key={orc.id}
            className={`flex cursor-pointer hover:bg-gray-100 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="table-cell flex-1 px-4 py-2 border border-gray-200">{orc.id}</div>
            <div className="table-cell flex-8 px-4 py-2 border border-gray-200 ">{orc.nome}</div>
            <div className="table-cell flex-3 px-4 py-2 border border-gray-200 text-center">
              {formataData(orc.dataInicio)}
            </div>
            <div className="table-cell flex-2 px-4 py-2 border border-gray-200 text-center">
              {formataStatus(orc.status)}
            </div>
            <div className="table-cell flex-2 px-4 py-2 border border-gray-200 text-center">
              {formataValor(orc.valor)}
            </div>
            <div className="table-cell flex-3 px-4 py-2 border border-gray-200 text-center">
              {formataData(orc.dataFim)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


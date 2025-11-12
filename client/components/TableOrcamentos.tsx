"use client";

import React, { useState } from "react";
import { UpdateOrcamento } from "./ApiOrcamentos";

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
  function formatarValorBRL(valor: number | string) {
    const numero = Number(String(valor).replace(/\D/g, "")) / 100;
    if (isNaN(numero)) return "R$ 0,00";

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editStates, setEditStates] = useState<Record<number, any>>({});

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);

    // Inicializa campos editáveis quando expande
    const orc = orcamentos.find((o) => o.id === id);
    if (orc && !editStates[id]) {
      setEditStates((prev) => ({
        ...prev,
        [id]: {
          valor: orc.valor,
          status: orc.status,
          dataFim: orc.dataFim || "",
        },
      }));
    }
  };

  const handleEditChange = (id: number, field: keyof Orcamento, value: string) => {
    if (field === "valor") {
      const valorNumerico = value.replace(/\D/g, "");
      const valorFormatado = formatarValorBRL(valorNumerico);
      setEditStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: valorFormatado },
      }));
    } else {
      setEditStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    }
  };

  const handleFieldChange = (id: number, field: string, value: any) => {
    setEditStates((prev) => {
      const updated = { ...prev[id], [field]: value };

      // Se o status for alterado para "Finalizado", define a data de hoje
      if (field === "status" && value === 2) {
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split("T")[0];
        updated.dataFim = dataFormatada;
      }

      return { ...prev, [id]: updated };
    });
  };

  const handleSave = async (id: number) => {
    const edits = editStates[id];
    if (!edits) return;
  
    // Encontra o orçamento original
    const original = orcamentos.find((o) => o.id === id);
    if (!original) return;
  
    // Mescla original + alterações
    const dadosAtualizados = {
      ...original,
      ...edits,
      valor: edits.valor?.toString() ?? original.valor.toString(),
      dataFim: edits.dataFim || original.dataFim,
    };
  
    try {
      const resposta = await UpdateOrcamento(id, dadosAtualizados);
  
      if (resposta.sucesso) {
        alert("Orçamento atualizado com sucesso!");
  
        // Atualiza estado local (se orcamentos for reativo)
        setEditStates((prev) => ({ ...prev, [id]: {} }));
        setExpandedId(null);
      } else {
        alert(resposta.mensagem || "Erro ao atualizar orçamento.");
      }
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      alert("Erro inesperado ao salvar.");
    }
    window.location.reload();
  };
  

  const formataData = (data?: string | null) => {
    if (!data) return "";
    const [year, month, day] = data.split("-");
    return `${day}/${month}/${year}`;
  };

  const formataValor = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formataStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Novo";
      case 1:
        return "Em andamento";
      default:
        return "Finalizado";
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
        <div className="table-cell flex-1 px-4 py-2 text-center">ID</div>
        <div className="table-cell flex-8 px-4 py-2 text-center">Nome</div>
        <div className="table-cell flex-3 px-4 py-2 text-center">Data Entrada</div>
        <div className="table-cell flex-2 px-4 py-2 text-center">Status</div>
        <div className="table-cell flex-2 px-4 py-2 text-center">Valor</div>
        <div className="table-cell flex-3 px-4 py-2 text-center">Data Finalizado</div>
      </div>

      {/* Linhas */}
      <div>
        {orcamentos.map((orc, index) => (
          <div key={orc.id} className="border-b border-gray-200">
            {/* Linha principal */}
            <div
              onClick={() => toggleExpand(orc.id)}
              className={`flex cursor-pointer hover:bg-gray-100 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="table-cell flex-1 px-4 py-2 text-center">
                {orc.id}
              </div>
              <div className="table-cell flex-8 px-4 py-2">{orc.nome}</div>
              <div className="table-cell flex-3 px-4 py-2 text-center">
                {formataData(orc.dataInicio)}
              </div>
              <div className="table-cell flex-2 px-4 py-2 text-center">
                {formataStatus(orc.status)}
              </div>
              <div className="table-cell flex-2 px-4 py-2 text-center">
                {formataValor(orc.valor)}
              </div>
              <div className="table-cell flex-3 px-4 py-2 text-center">
                {formataData(orc.dataFim)}
              </div>
            </div>

{/* Detalhes expansíveis */}
{expandedId === orc.id && (
  <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200 text-sm text-gray-700 animate-[expand_0.2s_ease-out]">
    {/* GRID: 4 colunas no md; descrição pega 2 colunas por 2 linhas (direita) */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* LINHA 1 - ESQUERDA: Nome (2 colunas) */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100 md:col-span-2">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Nome</p>
        <p className="text-gray-800">{orc.nome || "Sem nome disponível."}</p>
      </div>

      {/* DESCRIÇÃO - DIREITA: 2 colunas, 2 linhas (ocupa linhas 1 e 2) */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100 md:col-span-2 md:row-span-2">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Descrição</p>
        <p className="text-gray-800 whitespace-pre-line">
          {orc.descricao || "Sem descrição disponível."}
        </p>
      </div>

      {/* LINHA 2 - ESQUERDA: Celular (1 col) + E-mail (1 col) */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Celular</p>
        <p className="text-gray-800">{orc.celular}</p>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">E-mail</p>
        <p className="text-gray-800">{orc.email}</p>
      </div>

      {/* LINHA 3 - 4 colunas: Valor (input) | Status (botões) | Data Entrada | Data Finalização */}
      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Valor</p>
        <input
                type="text"
                value={editStates[orc.id]?.valor ?? orc.valor}
                onChange={(e) => handleEditChange(orc.id, "valor", e.target.value)}
                className="w-full border px-2 py-1 rounded text-right"
              />
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Status</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Novo", value: 0, color: "bg-blue-100 text-blue-700" },
            { label: "Em andamento", value: 1, color: "bg-yellow-100 text-yellow-700" },
            { label: "Finalizado", value: 2, color: "bg-green-100 text-green-700" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFieldChange(orc.id, "status", opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold border ${
                (editStates[orc.id]?.status ?? orc.status) === opt.value
                  ? `${opt.color} border-transparent`
                  : "bg-gray-100 text-gray-600 border-gray-200"
              } transition-all`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Data de Entrada</p>
        <p className="text-gray-800">{formataData(orc.dataInicio)}</p>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
        <p className="text-gray-500 text-xs font-medium uppercase mb-1">Data de Finalização</p>
        <p className="text-gray-800">
          {formataData(editStates[orc.id]?.dataFim ?? orc.dataFim) || "—"}
        </p>
      </div>
    </div>

    {/* Botão de salvar */}
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => handleSave(orc.id)}
        className="bg-[#631b32] text-white px-4 py-2 rounded-md font-medium hover:bg-[#A84C66] transition-all shadow-sm"
      >
        Salvar alterações
      </button>
    </div>
  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}
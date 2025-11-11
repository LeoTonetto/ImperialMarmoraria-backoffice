"use client";

import React, { useEffect, useState } from "react";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
  dataCriacao: string;
}

export default function ShowUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users`, {
            headers: {
              Accept: "text/plain",
            },
          });
          if (!response.ok) throw new Error("Erro ao buscar usuários");
          
          // Lê como texto e tenta converter
          const text = await response.text();
          
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            console.error("Resposta não está em JSON válido:", text);
            data = { users: [] };
          }
          
          // Se a API retorna {"users": [...]}:
          if (Array.isArray(data.users)) {
            setUsuarios(data.users);
          } else {
            // fallback se vier direto um array
            setUsuarios(Array.isArray(data) ? data : []);
          }
          
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500 py-4">Carregando usuários...</div>;

  if (!usuarios.length)
    return <div className="text-center text-gray-500 py-4">Nenhum usuário encontrado.</div>;

  return (
    <div className="table-fill w-full">
      {/* Cabeçalho */}
      <div className="table-header flex bg-gray-100 font-semibold items-center">
        <div className="table-cell flex-1 px-4 py-2 text-center">ID</div>
        <div className="table-cell flex-5 px-4 py-2 text-center">Nome</div>
        <div className="table-cell flex-10 px-4 py-2 text-center">E-mail</div>
        <div className="table-cell flex-2 px-4 py-2 text-center">Função</div>
      </div>

      {/* Linhas */}
      <div>
        {usuarios.map((user, index) => (
          <div key={user.id} className="border-b border-gray-200">
            {/* Linha principal */}
            <div
              className={`flex cursor-pointer hover:bg-gray-100 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="table-cell flex-1 px-4 py-2 text-center">{user.id}</div>
              <div className="table-cell flex-5 px-4 py-2">{user.name}</div>
              <div className="table-cell flex-10 px-4 py-2 text-center">{user.email}</div>
              <div className="table-cell flex-2 px-4 py-2 text-center">{user.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  // ---------- GET USERS ----------
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users`, {
          headers: { Accept: "text/plain" },
        });
        const text = await response.text();
        const data = JSON.parse(text || "{}");
        if (Array.isArray(data.users)) setUsuarios(data.users);
        else setUsuarios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  // ---------- POST USER ----------
  async function handleCreateUser() {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Preencha todos os campos.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log("Resposta da API:", text);

      if (!response.ok) throw new Error("Erro ao cadastrar usuário");

      alert("Usuário cadastrado com sucesso!");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "" });

      // Atualiza a lista
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- COMPONENTE ----------
  if (loading) return <div className="text-center text-gray-500 py-4">Carregando usuários...</div>;

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      {/* Header + Botão */}
      <div className="flex justify-between items-center bg-gray-100 border-b border-gray-200 px-6 py-3">
        <h2 className="font-bold text-[#1B5463] text-lg">Usuários Cadastrados</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#631b32] hover:bg-[#A84C66] text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Tabela */}
      <div className="flex bg-gray-50 font-semibold text-gray-700 border-b border-gray-200 text-sm">
        <div className="flex-[1] px-6 py-3 text-center">ID</div>
        <div className="flex-[3] px-6 py-3 text-left">Nome</div>
        <div className="flex-[5] px-6 py-3 text-left">E-mail</div>
        <div className="flex-[2] px-6 py-3 text-center">Função</div>
      </div>

      <div className="divide-y divide-gray-200">
        {usuarios.map((user, i) => (
          <div
            key={user.email || i}
            className={`flex text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
          >
            <div className="flex-[1] px-6 py-3 text-center">{user.id}</div>
            <div className="flex-[3] px-6 py-3">{user.name}</div>
            <div className="flex-[5] px-6 py-3">{user.email}</div>
            <div className="flex-[2] px-6 py-3 text-center">{user.role}</div>
          </div>
        ))}
      </div>

      {/* Modal de cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 relative">
            <h3 className="text-xl font-semibold text-[#1B5463] mb-4">Cadastrar Usuário</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-[#631b32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-[#631b32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-1 focus:ring-[#631b32] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={submitting}
                className="px-4 py-2 bg-[#631b32] text-white rounded-md font-medium hover:bg-[#A84C66] transition"
              >
                {submitting ? "Enviando..." : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

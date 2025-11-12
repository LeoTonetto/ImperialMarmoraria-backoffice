'use client'

import ShowUsuarios from "@/components/TableUsuarios";
import { useProtectPage } from '../../components/VerificaLogin'

export default function PageUsuarios() {
  useProtectPage({ requireAdmin: true })

  return (
    <div className="p-6 w-[95%]">
      <h1 className="text-2xl font-bold mb-6 text-[#1B5463]">Usuários Cadastrados</h1>
      <ShowUsuarios />
    </div>
  );
}
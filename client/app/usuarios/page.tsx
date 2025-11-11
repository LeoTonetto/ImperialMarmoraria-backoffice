import ShowUsuarios from "@/components/TableUsuarios";

export default function PageUsuarios() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1B5463]">Usuários Cadastrados</h1>
      <ShowUsuarios />
    </div>
  );
}
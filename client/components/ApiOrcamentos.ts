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

export interface GetOrcamentosResponse {
  orcamentos: Orcamento[];
}

/**
 * Busca orçamentos com filtros opcionais.
 * @param options.name Nome para pesquisa (opcional)
 * @param options.status Status para filtro (opcional)
 */
export async function GetOrcamentos(options?: { name?: string; status?: string }): Promise<GetOrcamentosResponse> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Orcamento`;

    // Adiciona query params se houver filtros
    const queryParams = new URLSearchParams();
    if (options?.name) queryParams.append("nome", options.name);
    if (options?.status) queryParams.append("status", options.status);

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Erro ao buscar orçamentos: ${response.statusText}`);
      return { orcamentos: [] };
    }

    const result: GetOrcamentosResponse = await response.json();
    return result;
  } catch (error) {
    console.error("GetOrcamentos error:", error);
    return { orcamentos: [] };
  }
}

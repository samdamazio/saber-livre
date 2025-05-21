import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let UpdatedAtText = "Carregando...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR", {});
  }

  return <div>Última atualização: {UpdatedAtText} </div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let databaseStatusText = "Carregando...";

  if (!isLoading && data) {
    const databaseInfo = data.dependencies.database;
    const maxConnections = databaseInfo.max_connections;
    const openedConnections = databaseInfo.opened_connections;
    const version = databaseInfo.version;
    databaseStatusText = (
      <>
        <div>Versão: {version} </div>
        <div>Conexões abertas: {openedConnections}</div>
        <div>Conexões máximas: {maxConnections}</div>
      </>
    );
  }
  return (
    <div>
      <h2>Status do Banco de Dados</h2>
      <p>{databaseStatusText}</p>
    </div>
  );
}

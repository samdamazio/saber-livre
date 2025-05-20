const { exec } = require("node:child_process");
// import com require pq nao vai ser transpilado

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    } else {
      console.log("\n\n✅ Postgres pronto para fazer conexões\n");
      return;
    }
  }
}

console.log("\n\n🔴 Aguardando Postgres aceitar conexões TCP/IP");
checkPostgres();

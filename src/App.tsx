import { useQuery } from "@tanstack/react-query";
import { healthQuery } from "./queries/health.ts";

const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: "medium" });

export function App() {
  const health = useQuery(healthQuery);

  let status = "checking";
  if (health.isError) status = "unreachable";
  if (health.isSuccess) {
    status = `${health.data.status}, checked ${timeFormat.format(new Date(health.data.time))}`;
  }

  return (
    <main>
      <h1>Isobar</h1>
      <p>API status: {status}</p>
    </main>
  );
}

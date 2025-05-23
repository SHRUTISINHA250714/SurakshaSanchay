import { auth } from "../../../../auth";

export async function GET() {
  const session = await auth();
  return new Response(JSON.stringify(session), {
    headers: { "Content-Type": "application/json" },
  });
}

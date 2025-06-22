import Landing from "@/components/landing";
import { getOptionalSession } from "@/lib/auth-utils";

export default async function HomePage() {
  const session = await getOptionalSession();
  
  return (
    <div className="">
      <Landing session={session} />
    </div>
  );
}
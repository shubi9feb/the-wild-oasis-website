import Navigation from "../_components/Navigation";
import { auth } from "../_lib/auth";
export const metadata = {
  title: "Update profile",
};
export default async function page() {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome {session?.user?.name}
      </h2>
    </div>
  );
}

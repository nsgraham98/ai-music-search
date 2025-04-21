import { ConnectJamendoButton } from "@/app/components/connect-jamendo.jsx";
import { useRouter } from "next/navigation";

export default function ConnectJamendoPage() {
  const router = useRouter();

  function handleOnClick() {
    router.push("/home"); // Redirect to the home page if the user clicks "No Thanks"
  }
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Connect to Jamendo</h1>
      <ConnectJamendoButton />
      <button
        onClick={handleOnClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        No Thanks
      </button>
    </div>
  );
}

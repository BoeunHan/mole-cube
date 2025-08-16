import { ChattingButton } from "@/components/ChattingButton";
import { CubeView } from "@/components/CubeView";

export default function Home() {
  return (
    <div className="h-full  border-red-300 box-border">
      <CubeView />
      <div className="fixed bottom-12 left-12">
        <ChattingButton />
      </div>
    </div>
  );
}

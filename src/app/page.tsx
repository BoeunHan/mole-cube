import { ChattingButton } from "@/components/ChattingButton";
import { CubeView } from "@/components/CubeView";
import { RotationButtonList } from "@/components/RotationButton";
import { CubeProvider } from "@/providers/CubeContext";

export default function Home() {
  return (
    <CubeProvider size={3}>
      <div className="h-full border-red-300 box-border">
        <CubeView />
        <div className="fixed bottom-12 left-12">
          <ChattingButton />
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
          <RotationButtonList />
        </div>
      </div>
    </CubeProvider>
  );
}

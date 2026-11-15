import { Plant } from '@/components/plants/Plant';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { usePlantStage } from '@/hooks/usePlantStage';

export default function HomeScreen() {
  const stage = usePlantStage();

  return (
    <ScreenFrame activeTab="home">
      <Plant stage={stage} />
    </ScreenFrame>
  );
}

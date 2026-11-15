import { Plant } from '@/components/plants/Plant';
import { ScreenFrame } from '@/components/ui/ScreenFrame';
import { usePlantStage } from '@/hooks/usePlantStage';

export default function HomeScreen() {
  const plant = usePlantStage();

  return (
    <ScreenFrame activeTab="home">
      <Plant stage={plant?.stage ?? null} flowerKey={plant?.flowerKey} />
    </ScreenFrame>
  );
}

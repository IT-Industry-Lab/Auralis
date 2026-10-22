import { Checkbox } from '@/shared/ui/checkbox';

export default function HomePage() {
  return (
    <div>
      <div
        className="test"
        style={{
          // display: 'flex',
          // justifyContent: 'center', // центрирование по горизонтали
          // alignItems: 'center', // центрирование по вертикали
          // width: '100vw', // вся ширина экрана
          // height: '100vh', // вся высота экрана
          boxSizing: 'border-box',
          backgroundColor: '#000000', // черный фон, как в Figma
        }}
      >
        <Checkbox label="Check-box" />
      </div>
    </div>
  );
}

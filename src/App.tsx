import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Sky, SoftShadows } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Player } from './components/Player';
import { Level } from './components/Level';
import { useGameStore } from './store/gameStore';

export default function App() {
  const { currentLevel, timer, enemiesAlive, levelComplete } = useGameStore();

  return (
    <div className="h-screen w-screen">
      <div className="absolute top-0 left-0 p-4 text-white z-10">
        <p>Level: {currentLevel}</p>
        <p>Time Remaining: {timer}s</p>
        <p>Enemies: {enemiesAlive}</p>
        <p className="mt-2 text-sm opacity-75">
          Controls: WASD to move, SPACE to jump<br />
          Left-click to shoot arrow, Right-click to throw boomerang
        </p>
      </div>

      {levelComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                useGameStore.getState().setCurrentLevel(currentLevel + 1);
                useGameStore.getState().setLevelComplete(false);
                useGameStore.getState().setTimer(60);
                useGameStore.getState().setIsSpawning(true);
              }}
            >
              Next Level
            </button>
          </div>
        </div>
      )}

      <Canvas shadows>
        <Suspense fallback={null}>
          <SoftShadows size={2.5} samples={16} focus={0.5} />
          <PerspectiveCamera 
            makeDefault 
            position={[20, 20, 20]} 
            fov={50}
            rotation={[-Math.PI / 4, Math.PI / 4, Math.PI / 6]}
          />
          
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.3} />
          <directionalLight
            castShadow
            position={[50, 50, 30]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-near={0.1}
            shadow-camera-far={200}
            shadow-bias={-0.0001}
          />
          
          <Physics gravity={[0, -30, 0]}>
            <Player />
            <Level />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
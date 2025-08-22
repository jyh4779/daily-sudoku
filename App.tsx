import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppLogger from './src/core/logger/AppLogger';
import { log } from './src/core/logger/log';
import SudokuScreen from './src/features/sudoku/SudokuScreen';

export default function App() {
  useEffect(() => {
    // 파일 로그 초기화 (내부 try/catch 내장)
    AppLogger.init();
    void log('APP', 'mounted');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      <SudokuScreen />
    </SafeAreaView>
  );
}
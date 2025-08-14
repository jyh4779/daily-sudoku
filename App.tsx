// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SudokuScreen from './src/features/sudoku/SudokuScreen';
import AspectStage9x16 from './src/app/AspectStage9x16';

export default function App() {
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<AspectStage9x16>
				<SudokuScreen />
			</AspectStage9x16>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#ffffff' } // 바깥 여백 화이트 유지
});

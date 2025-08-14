import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSudokuStore } from '../viewmodel/sudokuStore';

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function NumberPad() {
	const inputNumber = useSudokuStore(s => s.inputNumber);

	return (
		<View style={styles.pad}>
			{nums.map(n => (
				<Pressable
					key={n}
					style={({ pressed }) => [
						styles.key,
						pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
					]}
					onPress={() => inputNumber(n)}
				>
					<Text style={styles.keyText}>{n}</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	pad: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 6
	},
	key: {
		flex: 1,
		height: 52,
		borderRadius: 12,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 }
	},
	keyText: { fontSize: 18, fontWeight: '700', color: '#2c2c2c' }
});

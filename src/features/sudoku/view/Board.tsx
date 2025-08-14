// src/features/sudoku/view/Board.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSudokuStore } from '../viewmodel/sudokuStore';

type Props = {
	/** 보드 한 변의 픽셀 길이(선 포함). 제공하지 않으면 기본 셀 크기(36)로 계산 */
	size?: number;
};

const N = 9;
const DEFAULT_CELL = 36;

export default function Board({ size }: Props) {
	const values = useSudokuStore(s => s.values);
	const puzzle = useSudokuStore(s => s.puzzle);
	const selected = useSudokuStore(s => s.selected);
	const selectCell = useSudokuStore(s => s.selectCell);
	const notes = useSudokuStore(s => s.notes);

	// size가 주어지면 셀 크기를 거기서 계산, 아니면 기본값 사용
	const { CELL, BOARD } = useMemo(() => {
		if (size && size > 0) {
			const cell = Math.floor(size / N);
			return { CELL: cell, BOARD: cell * N };
		}
		return { CELL: DEFAULT_CELL, BOARD: DEFAULT_CELL * N };
	}, [size]);

	const dyn = StyleSheet.create({
		wrap: {
			alignSelf: 'center',
			backgroundColor: '#fff',
			borderRadius: 8,
			overflow: 'hidden',
			width: BOARD,
			height: BOARD
		},
		row: { flexDirection: 'row' },
		cell: {
			width: CELL,
			height: CELL,
			borderRightWidth: 1,
			borderBottomWidth: 1,
			borderColor: '#E5E7EB',
			alignItems: 'center',
			justifyContent: 'center'
		},
		thickTop: { borderTopWidth: 2, borderTopColor: '#111827' },
		thickLeft: { borderLeftWidth: 2, borderLeftColor: '#111827' },
		selCell: { backgroundColor: '#EEF2FF' },
		val: { fontSize: CELL * 0.5, color: '#1F2937' },
		fixedVal: { fontWeight: '700', color: '#111827' },
		notes: {
			width: '100%',
			height: '100%',
			flexDirection: 'row',
			flexWrap: 'wrap',
			paddingTop: Math.max(1, Math.round(CELL * 0.05))
		},
		note: {
			width: CELL / 3,
			textAlign: 'center',
			fontSize: Math.max(8, Math.round(CELL * 0.26)),
			lineHeight: Math.max(10, Math.round(CELL * 0.33)),
			color: '#111827'
		},
		// 빈 칸은 숨김
		noteHidden: {
			width: CELL / 3,
			textAlign: 'center',
			fontSize: Math.max(8, Math.round(CELL * 0.26)),
			lineHeight: Math.max(10, Math.round(CELL * 0.33)),
			color: '#111827',
			display: 'none'
		},
		// 바깥 굵은 테두리(오버레이)
		outerBorder: {
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			borderWidth: 2,
			borderColor: '#111827',
			borderRadius: 8
		}
	});

	return (
		<View style={dyn.wrap}>
			{Array.from({ length: N }).map((_, r) => (
				<View key={r} style={dyn.row}>
					{Array.from({ length: N }).map((__, c) => {
						const v = values[r][c];
						const fixed = !!(puzzle && puzzle[r][c] !== 0);
						const isSel = selected && selected.r === r && selected.c === c;

						return (
							<Pressable
								key={c}
								onPress={() => selectCell(r, c)}
								style={[
									dyn.cell,
									isSel && dyn.selCell,
									(r % 3 === 0) && dyn.thickTop,
									(c % 3 === 0) && dyn.thickLeft
								]}
							>
								{v > 0 ? (
									<Text style={[dyn.val, fixed && dyn.fixedVal]}>{v}</Text>
								) : (
									// 노트가 있을 때만 렌더
									notes[r][c].size > 0 ? (
										<View style={dyn.notes}>
											{Array.from({ length: 9 }).map((___, i) => {
												const num = i + 1;
												const has = notes[r][c].has(num);
												// 존재하는 숫자만 보이게, 나머지는 숨김
												if (!has) return <Text key={num} style={dyn.noteHidden}>{'\u00A0'}</Text>;
												return (
													<Text key={num} style={dyn.note}>
														{num}
													</Text>
												);
											})}
										</View>
									) : null
								)}
							</Pressable>
						);
					})}
				</View>
			))}
			<View pointerEvents="none" style={dyn.outerBorder} />
		</View>
	);
}

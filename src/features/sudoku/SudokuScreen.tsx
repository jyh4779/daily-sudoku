// src/features/sudoku/SudokuScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Board from './view/Board';
import NumberPad from './view/NumberPad';
import { useSudokuStore } from './viewmodel/sudokuStore';

export default function SudokuScreen() {
	const [unit, setUnit] = useState<number | null>(null);
	const [boardBox, setBoardBox] = useState<{ w: number; h: number } | null>(null);
    const noteMode = useSudokuStore(s => s.noteMode);
    const toggleNoteMode = useSudokuStore(s => s.toggleNoteMode);

	const onLayoutRoot = (e: LayoutChangeEvent) => {
		const h = e.nativeEvent.layout.height;
		setUnit(h / 16);							// 9:16 비율 레이아웃
	};

	// 보드 카드 영역의 실제 width/height 측정
	const onLayoutBoardArea = (e: LayoutChangeEvent) => {
		const { width, height } = e.nativeEvent.layout;
		setBoardBox({ w: width, h: height });
	};

	// 보드 패딩(카드 안쪽 여백) — 아래 styles.boardCard.padding 과 동일하게 유지
	const BOARD_PADDING = 6;
	const boardSide =
		boardBox
			? Math.max(
					0,
					Math.min(boardBox.w, boardBox.h) - BOARD_PADDING * 2	// 정사각형 한 변 길이
			  )
			: 0;

	return (
		<View style={styles.root} onLayout={onLayoutRoot}>
			{unit && (
				<>
					{/* 1/16 : 상단바 */}
					<View style={[styles.topBar, { height: unit }]}>
						<Text style={styles.topLeft}>실수: 0 / 3</Text>
						<Text style={styles.topTitle}>점수: 0</Text>
						<Text style={styles.topRight}>00:00</Text>
					</View>

					{/* 1/16 : 난이도 */}
					<View style={[styles.difficultyWrap, { height: unit }]}>
						<Text style={styles.difficulty}>초급</Text>
					</View>

					{/* 10/16 : 보드 (카드 영역을 측정) */}
					<View style={[styles.boardArea, { height: unit * 10 }]} onLayout={onLayoutBoardArea}>
						<View style={styles.boardCard}>
							{boardSide > 0 && (
								<View style={styles.boardInner}>
									<Board size={boardSide} />
								</View>
							)}
						</View>
					</View>

					{/* 1/16 : 기능키 */}
					<View style={[styles.tools, { height: unit }]}>
						<Text style={styles.tool}>↩ 실행 취소</Text>
						<Text style={styles.tool}>⌫ 지우개</Text>
						<Text style={styles.tool}>💡 자동 힌트</Text>
						<Text style={styles.tool}>✎ 노트</Text>
						<Text style={styles.toolDanger}>? 힌트</Text>

                        <Text
                            onPress={toggleNoteMode}
                            style={[styles.tool, noteMode && { color: '#2563eb', fontWeight: '700' }]}
                        >
                            ✎ 노트
                        </Text>

                        <Text style={styles.toolDanger}>? 힌트</Text>
					</View>

					{/* 3/16 : 숫자패드 */}
					<View style={[styles.padArea, { height: unit * 3 }]}>
						<NumberPad />
					</View>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: '#f6f7fb',
		paddingHorizontal: 12
	},

	/* ===== 상단바 ===== */
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 2
	},
	topLeft: { fontSize: 12, color: '#666' },
	topTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
	topRight: { fontSize: 12, color: '#666' },

	difficultyWrap: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	difficulty: { fontSize: 13, color: '#8a8a8a' },

	/* ===== 보드 ===== */
	boardArea: {
		justifyContent: 'center'
	},
	boardCard: {
		borderRadius: 12,
		backgroundColor: '#e7ebf2',
		padding: 6,								// ← 이 값이 BOARD_PADDING 과 동일해야 함
		shadowColor: '#000',
		shadowOpacity: 0.06,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	},
	boardInner: {
		alignItems: 'center',
		justifyContent: 'center'
	},

	/* ===== 기능키 ===== */
	tools: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 6
	},
	tool: { fontSize: 12, color: '#444' },
	toolDanger: { fontSize: 12, color: '#c43a3a' },

	/* ===== 숫자패드 ===== */
	padArea: {
		justifyContent: 'center',
		marginBottom: 6
	}
});


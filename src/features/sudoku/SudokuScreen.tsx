// src/features/sudoku/SudokuScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AspectFitContainer from '../../components/layout/AspectFitContainer';
import Board from './view/Board';
import NumberPad from './view/NumberPad';
import ActionButtons from './view/ActionButtons';
import { useSudokuStore } from './viewmodel/sudokuStore';

export default function SudokuScreen() {
  const loadRandomEasy = useSudokuStore(s => s.loadRandomEasy);

  useEffect(() => {
    loadRandomEasy().catch(e => {
      // eslint-disable-next-line no-console
      console.warn('[SudokuScreen] loadRandomEasy failed', e);
    });
  }, [loadRandomEasy]);

  const BOARD_PADDING = 6;

  return (
    <AspectFitContainer ratio={9 / 16} style={styles.root}>
      {({ width, height }) => {
        const unit = height / 16; // ✅ 9:16 박스 기준으로 16등분
        const boardSide = Math.max(
          0,
          Math.min(width, height) - BOARD_PADDING * 2
        );

        return (
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

            {/* 10/16 : 보드 */}
            <View style={[styles.boardArea, { height: unit * 10 }]}>
              <View style={styles.boardCard}>
                {boardSide > 0 && <Board size={boardSide} />}
              </View>
            </View>

            {/* 1/16 : 기능키 */}
            <View style={[styles.tools, { height: unit }]}>
              <ActionButtons />
            </View>

            {/* 3/16 : 숫자패드 */}
            <View style={[styles.padArea, { height: unit * 3 }]}>
              <NumberPad />
            </View>
          </>
        );
      }}
    </AspectFitContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f6f7fb', // 레터박스 영역과 동일한 배경
    paddingHorizontal: 12,
  },

  /* ===== 상단바 ===== */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  topLeft:  { fontSize: 12, color: '#666' },
  topTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  topRight: { fontSize: 12, color: '#666' },

  difficultyWrap: { alignItems: 'center', justifyContent: 'center' },
  difficulty: { fontSize: 13, color: '#8a8a8a' },

  /* ===== 보드 ===== */
  boardArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardCard: {
    borderRadius: 12,
    backgroundColor: '#e7ebf2',
    padding: 6, // ← BOARD_PADDING 과 동일
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ===== 기능키 ===== */
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },

  /* ===== 숫자패드 ===== */
  padArea: { justifyContent: 'center', marginBottom: 6 },
});

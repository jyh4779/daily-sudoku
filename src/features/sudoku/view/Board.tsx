// src/features/sudoku/view/Board.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSudokuStore } from '../viewmodel/sudokuStore';

type Props = { size: number };

const N = 9;
const empty9 = () => Array.from({ length: N }, () => Array(N).fill(0));

export default function Board({ size }: Props) {
  const values   = useSudokuStore(s => s.values);
  const puzzle   = useSudokuStore(s => s.puzzle);
  const selected = useSudokuStore(s => s.selected);
  const setSel   = useSudokuStore(s => s.setSelected);

  const vGrid = (values?.length === N && values.every(r => r?.length === N)) ? values : empty9();
  const pGrid = (puzzle?.length === N && puzzle.every(r => r?.length === N)) ? puzzle : empty9();

  // 선 두께 정의
  const THIN  = StyleSheet.hairlineWidth;       // 얇은 선
  const THICK = 2;                               // 굵은 선(필요하면 3으로)
  // 보드 전체에 존재하는 수직/수평 선의 총 두께 (0..9까지 10개 선: 0/3/6/9는 굵게)
  const LINES_SUM = (THICK * 4) + (THIN * 6);

  // 선 두께를 먼저 제외하고 셀 크기 산출 → 오차/이중선 제거
  const cell = Math.floor((size - LINES_SUM) / N);
  // 실 보드 픽셀 (셀*N + 선 두께 합)
  const boardSide = cell * N + LINES_SUM;

  return (
    <View style={[styles.board, { width: boardSide, height: boardSide }]}>
      {Array.from({ length: N }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: N }).map((_, c) => {
            const v      = vGrid[r][c];
            const fixed  = !!pGrid[r][c];
            const isSel  = !!(selected && selected.r === r && selected.c === c);

            // 각 셀은 "왼쪽/위쪽" 선만 그립니다. (마지막 행/열에서만 바깥쪽을 닫음)
            const cellBorder: StyleProp<ViewStyle> = {
              borderLeftWidth:  (c === 0 || c % 3 === 0) ? THICK : THIN,
              borderTopWidth:   (r === 0 || r % 3 === 0) ? THICK : THIN,
              // 바깥 테두리 마감
              borderRightWidth:  c === N - 1 ? THICK : 0,
              borderBottomWidth: r === N - 1 ? THICK : 0,
              borderColor: '#223041',
            };

            return (
              <Pressable
                key={c}
                onPress={() => setSel({ r, c })}
                style={[
                  styles.cell,
                  { width: cell, height: cell },
                  cellBorder,
                  fixed && styles.fixedCell,
                  isSel && styles.selectedCell,
                ]}
              >
                <Text style={[styles.text, fixed && styles.fixedText]}>
                  {v > 0 ? String(v) : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row' },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedCell:    { backgroundColor: '#f3f6fb' },
  selectedCell: { backgroundColor: '#eaf1ff' },
  text:      { color: '#1e2a3b', fontWeight: '500', fontSize: 18 },
  fixedText: { color: '#0f172a', fontWeight: '700' },
});

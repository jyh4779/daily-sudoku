import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, useWindowDimensions, Pressable } from 'react-native';
import Board from './view/Board';
import NumberPad from './view/NumberPad';
import ActionButtons from './view/ActionButtons';
import { useSudokuStore } from './viewmodel/sudokuStore';
import AspectFitContainer from '../../components/layout/AspectFitContainer';

const SudokuScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const GUTTER = Math.max(16, Math.min(24, Math.round(width * 0.04)));

  const [boardBox, setBoardBox] = useState<{ w: number; h: number } | null>(null);
  const loadRandomEasy = useSudokuStore(s => s.loadRandomEasy);
  const mistakes = useSudokuStore(s => s.mistakes);
  const mistakeLimit = useSudokuStore(s => s.mistakeLimit);
  const values = useSudokuStore(s => s.values);
  const solution = useSudokuStore(s => s.solution);
  const resetMistakes = useSudokuStore(s => s.resetMistakes);
  const restartCurrent = useSudokuStore(s => s.restartCurrent);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    loadRandomEasy().then(() => setElapsedSec(0)).catch(e => console.error(e));
  }, [loadRandomEasy]);

  const onLayoutBoardArea = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setBoardBox({ w, h });
  };

  const BOARD_PADDING = 6;

  // Detect end states
  const isSolved = useMemo(() => {
    if (!values || !solution) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (values[r]?.[c] !== solution[r]?.[c]) return false;
      }
    }
    return true;
  }, [values, solution]);
  const isLost = mistakes >= mistakeLimit;
  useEffect(() => {
    if (isLost || isSolved) return;
    const id = setInterval(() => setElapsedSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLost, isSolved]);
  const timeText = useMemo(() => {
    const h = Math.floor(elapsedSec / 3600);
    const m = Math.floor((elapsedSec % 3600) / 60);
    const s = elapsedSec % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }, [elapsedSec]);
  const handleRestart = () => { restartCurrent(); setElapsedSec(0); };
  const handleNewGame = () => { loadRandomEasy().then(() => setElapsedSec(0)); };

  return (
    <>
    <AspectFitContainer ratio={[9, 16]} outerGutter={GUTTER} backgroundColor="#f6f7fb">
      {({ width: stageW, height: stageH }: { width: number; height: number }) => {
        const unit = stageH / 16;
        // Compute actual drawable board side the same way Board.tsx does
        // to avoid rounding leftovers that make centering look off.
        let boardSide = 0;
        if (boardBox) {
          const avail = Math.max(0, Math.min(boardBox.w, boardBox.h) - BOARD_PADDING * 2);
          const THIN = StyleSheet.hairlineWidth;
          const THICK = 2;
          const LINES_SUM = THICK * 4 + THIN * 6;
          const cell = Math.max(0, Math.floor((avail - LINES_SUM) / 9));
          boardSide = cell * 9 + LINES_SUM;
        }

        return (
          <View style={{ width: stageW, height: stageH }}>
            <View style={[styles.topBar, { height: unit }]}>
              <Text style={styles.topLeft}>Faults: {mistakes} / {mistakeLimit}</Text>
              <Text style={styles.topTitle}>Score: 0</Text>
              <Text style={styles.topRight}>{timeText}</Text>
            </View>

            <View style={[styles.difficultyWrap, { height: unit }]}>
              <Text style={styles.difficulty}>Easy</Text>
            </View>

            <View style={[styles.boardArea, { height: unit * 10 }]} onLayout={onLayoutBoardArea}>
              <View
                style={[
                  styles.boardCard,
                  boardSide > 0 && {
                    width: boardSide + BOARD_PADDING * 2,
                    height: boardSide + BOARD_PADDING * 2,
                    padding: BOARD_PADDING,
                    alignSelf: 'center',
                  },
                ]}
              >
                {boardSide > 0 && <Board size={boardSide} />}
              </View>
            </View>

            <View style={[styles.tools, { height: unit }]}>
              <ActionButtons />
            </View>

            <View style={[styles.padArea, { height: unit * 3 }]}>
              <NumberPad />
            </View>
          </View>
        );
      }}
    </AspectFitContainer>
        {/* End-game overlays */}
    {(isLost || isSolved) && (
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{isLost ? "Loss" : "Success"}</Text>
          {isLost ? (
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalBtn} onPress={handleRestart}>
                <Text style={styles.modalBtnText}>Restart</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={resetMistakes}>
                <Text style={styles.modalBtnText}>Continue</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalBtn} onPress={handleNewGame}>
                <Text style={styles.modalBtnText}>New Game</Text>
              </Pressable>
              <Pressable style={styles.modalBtn} onPress={() => console.warn('TODO: navigate home')}>
                <Text style={styles.modalBtnText}>Home</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    )}</>
  );
};

export default SudokuScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  topLeft: { fontSize: 12, color: '#666' },
  topTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  topRight: { fontSize: 12, color: '#666' },

  difficultyWrap: { alignItems: 'center', justifyContent: 'center' },
  difficulty: { fontSize: 13, color: '#8a8a8a' },

  boardArea: { justifyContent: 'center', alignItems: 'center' },
  boardCard: {
    borderRadius: 12,
    backgroundColor: '#e7ebf2',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  padArea: { justifyContent: 'center', marginBottom: 6 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    minWidth: 240,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 12 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  modalBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalBtnText: { color: '#fff', fontWeight: '700' },
});











// src/features/sudoku/viewmodel/sudokuStore.ts
import { create } from 'zustand';
import type { Grid, Pair } from '../data/puzzleLoader';
import { loadPairsFromAssets, pickRandomPair } from '../data/puzzleLoader';

// 정적 에셋 require (상대경로: viewmodel -> sudoku -> features -> src -> assets/puzzles)
const EASY_PUZZLES = require('../../../assets/puzzles/Easy.sudoku');
const EASY_SOLUTIONS = require('../../../assets/puzzles/Easy_output.sudoku');

type Pos = { r: number; c: number } | null;
type Notes = Array<Array<Set<number>>>;

const makeEmptyNotes = (): Notes =>
	Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));

type State = {
	selected: Pos;
	noteMode: boolean;
	notes: Notes;

	// 퍼즐/정답/현재값
	puzzle?: Grid;
	solution?: Grid;
	values: Grid;

	// actions
	selectCell: (r: number, c: number) => void;
	toggleNoteMode: () => void;
	inputNumber: (n: number) => void;
	clearNotesAt: (r: number, c: number) => void;
	clearAllNotes: () => void;

	loadRandomEasy: () => Promise<void>;
	setPair: (pair: Pair) => void;
};

const empty9 = (): Grid => Array.from({ length: 9 }, () => Array(9).fill(0));

export const useSudokuStore = create<State>((set, get) => ({
	selected: null,
	noteMode: false,
	notes: makeEmptyNotes(),
	values: empty9(),

	selectCell: (r, c) => set({ selected: { r, c } }),
	toggleNoteMode: () => set(s => ({ noteMode: !s.noteMode })),

	inputNumber: (n) => {
		const { selected, noteMode, notes, values, puzzle } = get();
		if (!selected) return;
		const { r, c } = selected;

		if (noteMode) {
			// 노트 토글
			const next = makeEmptyNotes();
			for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) next[i][j] = new Set(notes[i][j]);
			if (next[r][c].has(n)) next[r][c].delete(n);
			else next[r][c].add(n);
			set({ notes: next });
		} else {
			// 실제 값 입력 (초기 퍼즐 고정값은 수정 금지)
			if (puzzle && puzzle[r][c] !== 0) return;
			const next = values.map(row => row.slice());
			next[r][c] = n;
			set({ values: next });
		}
	},

	clearNotesAt: (r, c) => {
		const { notes } = get();
		const next = makeEmptyNotes();
		for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++)
			next[i][j] = i === r && j === c ? new Set() : new Set(notes[i][j]);
		set({ notes: next });
	},

	clearAllNotes: () => set({ notes: makeEmptyNotes() }),

	setPair: ({ puzzle, solution }) => {
		set({
			puzzle,
			solution,
			// 시작값은 퍼즐 그대로(0은 빈칸)
			values: puzzle.map(row => row.slice()),
			notes: makeEmptyNotes(),
			noteMode: false     
		});
	},

	loadRandomEasy: async () => {
		const pairs = await loadPairsFromAssets(EASY_PUZZLES, EASY_SOLUTIONS);
		const picked = pickRandomPair(pairs);
		get().setPair(picked);
	}
}));

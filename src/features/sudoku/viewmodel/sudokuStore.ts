import { create } from 'zustand';

type Pos = { r: number; c: number } | null;

// 9x9 각 칸에 Set<number> (1~9 노트)
type Notes = Array<Array<Set<number>>>;

const makeEmptyNotes = (): Notes =>
	Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));

type State = {
	selected: Pos;
	noteMode: boolean;
	notes: Notes;
	selectCell: (r: number, c: number) => void;
	toggleNoteMode: () => void;
	inputNumber: (n: number) => void; // noteMode일 때 노트 토글
	clearNotesAt: (r: number, c: number) => void;
	clearAllNotes: () => void;
};

export const useSudokuStore = create<State>((set, get) => ({
	selected: null,
	noteMode: true, // 기본: 노트 모드 ON (원하면 false로 시작)
	notes: makeEmptyNotes(),

	selectCell: (r, c) => set({ selected: { r, c } }),

	toggleNoteMode: () => set(s => ({ noteMode: !s.noteMode })),

	inputNumber: (n) => {
		const { selected, noteMode, notes } = get();
		if (!selected) return;
		const { r, c } = selected;
		if (noteMode) {
			// 노트 토글
			const next = makeEmptyNotes();
			// 얕은 복사: 기존 notes의 Set을 그대로 재사용
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					next[i][j] = new Set(notes[i][j]); // Set 복사
				}
			}
			if (next[r][c].has(n)) next[r][c].delete(n);
			else next[r][c].add(n);
			set({ notes: next });
		} else {
			// 다음 단계: 실제 값 입력 로직 연결 예정
		}
	},

	clearNotesAt: (r, c) => {
		const { notes } = get();
		const next = makeEmptyNotes();
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				next[i][j] = i === r && j === c ? new Set() : new Set(notes[i][j]);
			}
		}
		set({ notes: next });
	},

	clearAllNotes: () => set({ notes: makeEmptyNotes() })
}));

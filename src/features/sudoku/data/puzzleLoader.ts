import { readAssetText } from '../../../utils/readAssetText';

// 퍼즐 1개는 9x9 number 배열(0=빈칸)
export type Grid = number[][];
export type Pair = { puzzle: Grid; solution: Grid };

const reValid = /^[0-9.\s]+$/;

/** 텍스트에서 9x9 퍼즐들 추출 */
function parseSudokuList(text: string): Grid[] {
	const lines = text
		.split(/\r?\n/)
		.map(l => l.trim())
		.filter(l => l.length > 0 && reValid.test(l));

	const out: Grid[] = [];
	let buf: string[] = [];

	for (const ln of lines) {
		// 길이가 9 이상인 행에서 숫자/./0만 추출
		const row = ln.replace(/[^0-9.]/g, '').slice(0, 9);
		if (row.length !== 9) continue;
		buf.push(row);
		if (buf.length === 9) {
			const g: Grid = buf.map(r =>
				[...r].map(ch => (ch === '.' ? 0 : Number(ch) || 0))
			);
			out.push(g);
			buf = [];
		}
	}
	return out;
}

/** require(...) 모듈 아이디로 퍼즐/정답 파일을 읽고 pair 배열을 만든다 */
export async function loadPairsFromAssets(
	puzzleModuleId: number,
	solutionModuleId: number
): Promise<Pair[]> {
	const [pTxt, sTxt] = await Promise.all([
		readAssetText(puzzleModuleId),
		readAssetText(solutionModuleId)
	]);

	const puzzles = parseSudokuList(pTxt);
	const solutions = parseSudokuList(sTxt);

	if (puzzles.length === 0) throw new Error('No puzzles parsed');
	if (puzzles.length !== solutions.length) {
		console.warn(
			`Puzzle/Solution count mismatch: ${puzzles.length} vs ${solutions.length}. Pairing by index until min length.`
		);
	}

	const n = Math.min(puzzles.length, solutions.length);
	return Array.from({ length: n }, (_, i) => ({
		puzzle: puzzles[i],
		solution: solutions[i]
	}));
}

/** 한 세트를 랜덤으로 선택 */
export function pickRandomPair(pairs: Pair[]): Pair {
	if (!pairs.length) throw new Error('Empty pairs');
	const idx = Math.floor(Math.random() * pairs.length);
	return pairs[idx];
}

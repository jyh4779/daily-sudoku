import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useSudokuStore } from '../viewmodel/sudokuStore';

type Props = {
	size: number;
	style?: ViewStyle;
};

const SIZE = 9;
const THIN = 1;
const THICK = 2;
const INSET = THICK / 2;

export default function Board({ size, style }: Props) {
	const selected = useSudokuStore(s => s.selected);
	const selectCell = useSudokuStore(s => s.selectCell);
	const notes = useSudokuStore(s => s.notes);

	if (!size || size <= 0) return null;

	const L = INSET;
	const R = size - INSET;
	const W = R - L;
	const cell = W / SIZE;
	const snap = (v: number) => Math.round(v) + 0.5;

	// 셀 좌표 -> 픽셀 사각형 좌표
	const cellRect = (r: number, c: number) => {
		const x = L + c * cell;
		const y = L + r * cell;
		return { x, y, w: cell, h: cell };
	};

	// 노트 텍스트 위치(3x3 소그리드)
	const notePos = (k: number) => {
		const ix = (k - 1) % 3; // 0..2
		const iy = Math.floor((k - 1) / 3); // 0..2
		return { ix, iy };
	};

	return (
		<Svg width={size} height={size} style={style}>
			{/* 배경 */}
			<Rect x={0} y={0} width={size} height={size} fill="#fff" rx={8} />

			{/* 선택 셀 하이라이트 */}
			{selected && (() => {
				const { x, y, w, h } = cellRect(selected.r, selected.c);
				return (
					<Rect
						x={x + 1}
						y={y + 1}
						width={w - 2}
						height={h - 2}
						fill="#e6f0ff"
						opacity={0.7}
						rx={4}
					/>
				);
			})()}

			{/* 세로선 */}
			{[...Array(SIZE + 1)].map((_, i) => {
				const x = L + i * cell;
				const thick = i % 3 === 0 ? THICK : THIN;
				const color = i % 3 === 0 ? '#333' : '#bbb';
				return (
					<Line
						key={`v-${i}`}
						x1={snap(x)}
						y1={L}
						x2={snap(x)}
						y2={R}
						stroke={color}
						strokeWidth={thick}
						strokeLinecap="square"
					/>
				);
			})}

			{/* 가로선 */}
			{[...Array(SIZE + 1)].map((_, i) => {
				const y = L + i * cell;
				const thick = i % 3 === 0 ? THICK : THIN;
				const color = i % 3 === 0 ? '#333' : '#bbb';
				return (
					<Line
						key={`h-${i}`}
						x1={L}
						y1={snap(y)}
						x2={R}
						y2={snap(y)}
						stroke={color}
						strokeWidth={thick}
						strokeLinecap="square"
					/>
				);
			})}

			{/* 각 셀의 노트 렌더링 */}
			{notes.map((row, r) =>
				row.map((set, c) => {
					if (!set.size) return null;
					const { x, y } = cellRect(r, c);
					const sub = cell / 3;
					const fontSize = sub * 0.5; // 소글씨 크기
					const fill = '#6b7280'; // 회색 계열

					return (
						<React.Fragment key={`notes-${r}-${c}`}>
							{Array.from(set)
								.sort((a, b) => a - b)
								.map(n => {
									const { ix, iy } = notePos(n);
									const cx = x + ix * sub + sub / 2;
									const cy = y + iy * sub + sub / 2 + fontSize * 0.33; // 시각적 보정
									return (
										<SvgText
											key={`n-${r}-${c}-${n}`}
											x={cx}
											y={cy}
											fontSize={fontSize}
											fontWeight="500"
											fill={fill}
											textAnchor="middle"
										>
											{String(n)}
										</SvgText>
									);
								})}
						</React.Fragment>
					);
				})
			)}

			{/* 터치 캡처: 투명 사각형 81개 */}
			{[...Array(9)].map((_, r) =>
				[...Array(9)].map((_, c) => {
					const { x, y, w, h } = cellRect(r, c);
					return (
						<Rect
							key={`hit-${r}-${c}`}
							x={x}
							y={y}
							width={w}
							height={h}
							fill="transparent"
							onPress={() => selectCell(r, c)}
						/>
					);
				})
			)}
		</Svg>
	);
}

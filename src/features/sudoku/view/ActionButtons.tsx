import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { useSudokuStore } from '../viewmodel/sudokuStore';
import EraserIcon from '../../../assets/icons/eraser.svg';
import UndoIcon from '../../../assets/icons/undo.svg';

type Action = 'undo' | 'erase' | 'note' | 'hint';

type BtnProps = {
	action: Action;
	label: string;
	active?: boolean;
	onPress: () => void;
};

const size = 28;

// 임포트한 SVG를 그대로 쓰고, 나머지 두 개(노트/힌트)만 코드로 그립니다.
function NoteIcon({ active }: { active?: boolean }) {
	const color = active ? '#2563eb' : '#374151';
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
			<G stroke={color} strokeWidth="1.6" strokeLinecap="round">
				<Path d="M8 8h8" />
				<Path d="M8 12h8" />
				<Path d="M8 16h5" />
			</G>
		</Svg>
	);
}
function HintIcon() {
	return (
		<Svg width={size} height={size} viewBox="0 0 24 24">
			<Path d="M12 3a7 7 0 016.9 6.03c.2 1.44-.18 2.9-1.05 4.04-.62.82-1.35 1.52-1.85 2.41-.35.62-.57 1.32-.65 2.04H8.65c-.08-.72-.3-1.42-.65-2.04-.5-.89-1.23-1.6-1.85-2.41A5.98 5.98 0 015.1 9.03 7 7 0 0112 3z" fill="#FDE68A" stroke="#374151" strokeWidth="1.5" />
			<Path d="M9 20h6" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
		</Svg>
	);
}

function Icon({ action, active }: { action: Action; active?: boolean }) {
	switch (action) {
		case 'undo':
			return <UndoIcon width={size} height={size} />;
		case 'erase':
			return <EraserIcon width={size} height={size} />;
		case 'note':
			return <NoteIcon active={active} />;
		case 'hint':
			return <HintIcon />;
	}
}

const ActionButton = ({ action, label, active, onPress }: BtnProps) => {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
			hitSlop={8}
		>
			<Icon action={action} active={active} />
			<Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
		</Pressable>
	);
};

export default function ActionButtons() {
	const noteMode = useSudokuStore(s => s.noteMode);
	const toggleNoteMode = useSudokuStore(s => s.toggleNoteMode);
	const selected = useSudokuStore(s => s.selected);
	const clearNotesAt = useSudokuStore(s => s.clearNotesAt);

	// TODO: undo는 이후 히스토리 스택 구현 시 연결
	const onUndo = () => console.warn('TODO: undo');

	const onErase = () => {
		if (selected) clearNotesAt(selected.r, selected.c); // 값 입력 구현 전까지는 해당 칸 노트만 지움
	};

	const onNote = () => toggleNoteMode();
	const onHint = () => console.warn('TODO: hint');

	return (
		<View style={styles.row}>
			<ActionButton action="undo" label="실행취소" onPress={onUndo} />
			<ActionButton action="erase" label="지우개" onPress={onErase} />
			<ActionButton action="note" label="노트" onPress={onNote} active={noteMode} />
			<ActionButton action="hint" label="힌트" onPress={onHint} />
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingHorizontal: 6
	},
	btn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 4
	},
	label: {
		marginTop: 4,
		fontSize: 11,
		color: '#4B5563'
	},
	activeLabel: {
		color: '#2563eb',
		fontWeight: '700'
	}
});

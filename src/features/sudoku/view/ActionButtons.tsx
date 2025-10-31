import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { useSudokuStore } from '../viewmodel/sudokuStore';
import EraserIcon from '../../../assets/icons/eraser.svg';
import UndoIcon from '../../../assets/icons/undo.svg';

type Action = 'undo' | 'erase' | 'note' | 'hint' | 'padmode';

type BtnProps = {
  action: Action;
  label: string;
  active?: boolean;
  onPress: () => void;
};

const size = 28;

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
    case 'padmode':
      // simple crosshair icon
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={active ? '#2563eb' : '#374151'} strokeWidth="2" strokeLinecap="round"/>
          <Path d="M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" stroke={active ? '#2563eb' : '#374151'} strokeWidth="2" fill="none" />
        </Svg>
      );
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
  const noteMode = useSudokuStore(s => s.noteMode ?? false);
  const toggleNoteMode = useSudokuStore(s => s.toggleNoteMode ?? (() => {}));
  const undo = useSudokuStore(s => s.undo);
  const eraseSelected = useSudokuStore(s => s.eraseSelected);
  const padSelectMode = useSudokuStore(s => s.padSelectMode ?? false);
  const togglePadSelectMode = useSudokuStore(s => s.togglePadSelectMode ?? (() => {}));

  const onUndo = () => {
    if (undo) undo();
  };

  const onErase = () => {
    if (eraseSelected) eraseSelected();
  };

  const onNote = () => toggleNoteMode();
  const onHint = () => console.warn('TODO: hint');
  const onPadMode = () => togglePadSelectMode();

  return (
    <View style={styles.row}>
      <ActionButton action="undo" label="Undo" onPress={onUndo} />
      <ActionButton action="erase" label="Erase" onPress={onErase} />
      {/* Swap order so ?ΈνΈ and ?€?…λ ¥ are adjacent */}
      <ActionButton action="hint" label="Hint" onPress={onHint} />
      <ActionButton action="note" label="Notes" onPress={onNote} active={noteMode} />
      <ActionButton action="padmode" label="Tap to Fill" onPress={onPadMode} active={padSelectMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: '#4B5563',
  },
  activeLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },
});



import React, { useState } from 'react';
import { View, LayoutChangeEvent, StyleSheet, ViewStyle } from 'react-native';

type Box = { width: number; height: number };
type Props = {
  /** width / height (예: 9/16) */
  ratio?: number;
  /** 박스 바깥 영역의 스타일(배경색 등) */
  style?: ViewStyle;
  /** 박스 안에서 렌더링할 내용 (박스 크기를 인자로 제공) */
  children: (box: Box) => React.ReactNode;
};

export default function AspectFitContainer({ ratio = 9 / 16, style, children }: Props) {
  const [parent, setParent] = useState<Box | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setParent({ width, height });
  };

  // 부모의 w/h 대비 목표 비율에 맞춰 "맞춰 넣기"
  const getBox = (p: Box): Box => {
    const { width: W, height: H } = p;
    const parentRatio = W / H;
    if (parentRatio > ratio) {
      // 가로가 넓음 → 높이에 맞춰서
      const height = H;
      const width = Math.floor(H * ratio);
      return { width, height };
    } else {
      // 세로가 길음 → 너비에 맞춰서
      const width = W;
      const height = Math.floor(W / ratio);
      return { width, height };
    }
  };

  const box = parent ? getBox(parent) : null;

  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      {box && (
        <View style={[styles.box, { width: box.width, height: box.height }]}>
          {children(box)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',   // 박스 가로 중앙
    justifyContent: 'center', // 박스 세로 중앙 (레터박스)
  },
  box: {
    alignSelf: 'center',
  },
});
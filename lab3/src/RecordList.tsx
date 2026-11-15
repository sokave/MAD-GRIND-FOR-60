import { useMemo, type ReactNode } from 'react';
import { StyleSheet, Text, View, VirtualizedList, type ListRenderItem } from 'react-native';
import { Icon, theme } from './ui';

const gap = 9;

function getItem<T>(data: readonly T[], index: number) {
  return data[index];
}

function getItemCount(data: readonly unknown[]) {
  return data.length;
}

function keyExtractor(item: { id: string }) {
  return item.id;
}

function Separator() {
  return <View style={styles.separator} />;
}

export function RecordList<T extends { id: string }>({
  data, rowHeight, renderItem, empty, name,
}: {
  data: readonly T[]; rowHeight: number; renderItem: ListRenderItem<T>;
  empty: ReactNode; name: string;
}) {
  const getItemLayout = useMemo(() => (_: unknown, index: number) => ({
    index, length: rowHeight, offset: (rowHeight + gap) * index,
  }), [rowHeight]);

  return (
    <VirtualizedList
      testID={name}
      data={data}
      getItem={getItem}
      getItemCount={getItemCount}
      getItemLayout={getItemLayout}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={7}
      style={theme.fill}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={[theme.card, styles.empty]}>
          <Icon name="search-outline" size={26} />
          <Text style={theme.body}>{empty}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 22 },
  separator: { height: gap },
  empty: { padding: 22, alignItems: 'center', gap: 10 },
});

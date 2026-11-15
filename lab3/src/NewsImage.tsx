import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { coverUrls } from './data';
import { colors, Icon } from './ui';

const localCovers: Record<string, ImageSourcePropType> = {
  [coverUrls.team]: require('../assets/student-team.png'),
  [coverUrls.campus]: require('../assets/university-campus.png'),
  [coverUrls.partnership]: require('../assets/international-partnership.png'),
};

export function NewsImage({ url, style }: { url: string; style?: StyleProp<ViewStyle> }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <View style={[styles.frame, style]}>
      {url && url !== failedUrl ? (
        <Image
          source={localCovers[url] ?? { uri: url }}
          resizeMode="cover"
          style={styles.image}
          onError={() => setFailedUrl(url)}
        />
      ) : <Icon name="image-outline" size={23} />}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
});

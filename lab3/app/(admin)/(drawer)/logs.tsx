import type { ListRenderItem } from 'react-native';
import { useAdmin } from '../../../src/admin';
import { AuditRow, auditRowHeight } from '../../../src/AuditRow';
import type { AuditEntry } from '../../../src/data';
import { RecordList } from '../../../src/RecordList';
import { Page, PageIntro } from '../../../src/ui';

const render: ListRenderItem<AuditEntry> = ({ item }) => <AuditRow entry={item} />;

export default function LogsScreen() {
  const { records } = useAdmin();
  return (
    <Page>
      <PageIntro title="Системні логи" description={'Записів у журналі · ' + records.logs.length} />
      <RecordList name="audit-list" data={records.logs} rowHeight={auditRowHeight} renderItem={render} empty="У журналі ще немає дій." />
    </Page>
  );
}

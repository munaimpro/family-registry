import { VERSION_LOGS } from '../../lib/version-data';
import { VersionLogView } from '../../components/VersionLogView';

export const metadata = {
    title: 'ভার্সন ও আপডেট লগ (Version & Change Log) | OMSKP Data Bank',
    description: 'অলি মিয়া সমাজ কল্যাণ পরিষদ ডেটা ব্যাংকের সকল সংস্করণ, নতুন ফিচার এবং পরিবর্তনের আনুষ্ঠানিক বিবরণী।',
};

export default function VersionLogPage() {
    return <VersionLogView logs={VERSION_LOGS} />;
}

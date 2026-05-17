import MockExamView from './MockExamView';
interface Props { lang: 'en' | 'uz'; }
const Reading = ({ lang }: Props) => <MockExamView lang={lang} type="reading" />;
export default Reading;

import MockExamView from './MockExamView';
interface Props { lang: 'en' | 'uz'; }
const Listening = ({ lang }: Props) => <MockExamView lang={lang} type="listening" />;
export default Listening;

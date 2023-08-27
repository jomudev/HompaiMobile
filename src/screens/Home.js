import { 
  Layout, 
  Text,
} from '../components/UI';
import {
  ArticlesListSection,
  ArticlesHeader,
  ArticlesList,
  ArticlesFooter,
} from '../components/HomeComponents';

export default function Home () {

  return (
    <Layout>
      <ArticlesListSection
        header={<ArticlesHeader />}
        content={<ArticlesList />}
        />
        <ArticlesFooter />
    </Layout>
  );
};
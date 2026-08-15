import { useState } from 'react';
import { Layout } from './components/common/Layout';
import { ShortenForm } from './features/shorten/ShortenForm';
import { LinkList } from './features/shorten/LinkList';
import type { Link } from './services/api';

function App() {
  const [links, setLinks] = useState<Link[]>([]);

  function handleLinkCreated(link: Link) {
    setLinks((prev) => [link, ...prev]);
  }

  return (
    <Layout>
      <ShortenForm onLinkCreated={handleLinkCreated} />
      <LinkList links={links} />
    </Layout>
  );
}

export default App;
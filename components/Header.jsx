import Head from 'next/head';
import Link from 'next/link';

const Header = ({ title }) => {
  return (
    <>
      <Head>
        <title className='pkmn-title'>{title || 'Get your Pokemon'}</title>
      </Head>
      <nav className='pkmn-header py-2'>
        <Link href='/'>
          {/* eslint-disable-next-line */}
          <a>
            <h1>Pokedex</h1>
          </a>
        </Link>
      </nav>
    </>
  );
};

export default Header;

import Link from 'next/link';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();
  return (
    <nav className='fixed-bottom navbar-light bg-light'>
      <div className='row'>
        <Link href='/'>
          <div
            className={`col-6 text-center py-2 ${
              router.pathname === '/' ? 'pkmn-footer-active' : 'pkmn-footer'
            }`}
          >
            {/* eslint-disable-next-line */}
            <a>
              Catch
              <br />
              Pokemon!
            </a>
          </div>
        </Link>
        <Link href='/my-pokemon'>
          <div
            className={`col-6 text-center py-2 ${
              router.pathname === '/my-pokemon'
                ? 'pkmn-footer-active'
                : 'pkmn-footer'
            }`}
          >
            {/* eslint-disable-next-line */}
            <a>
              My
              <br />
              Pokemon
            </a>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Footer;

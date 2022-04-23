import Layout from 'components/Layout';
import Link from 'next/link';

const errorPages = () => {
  const randomPokemon = Math.floor(Math.random() * 299 + 1);

  return (
    <Layout title='Page you find is not found!'>
      <div className='row pkmn-margin-footer'>
        <div className='col-12 row justify-content-center'>
          <div className='col-12 col-md-3 d-flex justify-content-center mt-3'>
            <img
              src='/emptyIllustration.svg'
              alt='emptyData'
              className='img-fluid mx-auto'
            />
          </div>
          <div className='w-100' />
          <div className='col-12 col-md-6 text-center mt-3'>
            <h1>Page you are looking is not found</h1>
            <h3>Want to try catch a random Pokemon?</h3>
            <Link href={`/pokemon/${randomPokemon}`}>
              {/* eslint-disable-next-line */}
                <a className='pkmn-card-detail__link btn block '>
                Catch Random Pokemon
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default errorPages;

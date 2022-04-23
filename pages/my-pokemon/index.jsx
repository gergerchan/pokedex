import { useState } from 'react';
import Layout from 'components/Layout';
import axios from 'axios';
import { Button, Spinner } from 'reactstrap';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrlMyPokemon = process.env.NEXT_PUBLIC_API_URLMYPOKEMON;

const index = ({ data }) => {
  const [pokemonList, setPokemonList] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const getDataDetailPokemon = async (pokemonData) => {
    const detailPokemon = await Promise.all(
      pokemonData.map(async (item) => {
        const dataPokemon = await axios.get(
          `${baseUrl}/pokemon/${item.pokemonId}`,
        );
        const myPokemonDetail = {
          nickname: item.nickname,
          myPokemonId: item.id,
          ...dataPokemon.data,
        };
        return myPokemonDetail;
      }),
    );
    return detailPokemon;
  };

  const handleRelease = async (pokemonId) => {
    setIsLoading(true);
    await axios.delete(`${baseUrlMyPokemon}/${pokemonId}`);
    const myPokemon = await axios.get(baseUrlMyPokemon);
    if (myPokemon.data.data !== 'No Data') {
      const detailPokemon = await getDataDetailPokemon(myPokemon.data.data);
      setPokemonList(detailPokemon);
    } else {
      setPokemonList(null);
    }
    setIsLoading(false);
  };

  const randomPokemon = Math.floor(Math.random() * 299 + 1);

  return (
    <Layout title='My Pokemon'>
      <div className='row pkmn-margin-footer'>
        {pokemonList ? (
          <>
            {pokemonList.map((item) => (
              <div className='col-12 col-md-4 p-2' key={item.order}>
                <div className={`pkmn-card p-3 ${item.types[0].type.name}`}>
                  <img
                    src={item.sprites.other['official-artwork'].front_default}
                    alt={item.name}
                    className='img-fluid mx-auto'
                  />
                  <h2 className='pkmn-card-title__catched'>{item.nickname}</h2>
                  <div className='row px-2'>
                    {item.types.map((type) => (
                      <div
                        className={`col pkmn-card-title__type mx-1 ${type.type.name}`}
                        key={type.slot}
                      >
                        {type.type.name}
                      </div>
                    ))}
                  </div>
                  <div className='row mt-2'>
                    <div className='col-12 text-center'>
                      {isLoading ? (
                        <Button
                          className='pkmn-button'
                          block
                          disabled
                          onClick={() => handleRelease(item.myPokemonId)}
                        >
                          <Spinner type='grow' size='sm' />
                          {'  '}
                          Release {item.nickname}
                        </Button>
                      ) : (
                        <Button
                          className='pkmn-button'
                          block
                          onClick={() => handleRelease(item.myPokemonId)}
                        >
                          Release {item.nickname}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
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
              <h1>You don&quot;t have a pokemon</h1>
              <h3>Try to catch a random Pokemon</h3>
              <Link href={`/pokemon/${randomPokemon}`}>
                {/* eslint-disable-next-line */}
                <a className='pkmn-card-detail__link btn block '>
                  Catch Random Pokemon
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default index;

const getDataDetailPokemon = async (data) => {
  const detailPokemon = await Promise.all(
    data.map(async (item) => {
      const dataPokemon = await axios.get(
        `${baseUrl}/pokemon/${item.pokemonId}`,
      );
      const myPokemonDetail = {
        nickname: item.nickname,
        myPokemonId: item.id,
        ...dataPokemon.data,
      };
      return myPokemonDetail;
    }),
  );
  return detailPokemon;
};

export async function getServerSideProps() {
  let detailPokemon = null;
  const myPokemon = await axios.get(baseUrlMyPokemon);
  if (myPokemon.data.data !== 'No Data') {
    detailPokemon = await getDataDetailPokemon(myPokemon.data.data);
  }
  return {
    props: {
      data: detailPokemon,
    },
  };
}

import Layout from 'components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'reactstrap';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrlMyPokemon = process.env.NEXT_PUBLIC_API_URLMYPOKEMON;

const index = ({ data, myPokemon }) => {
  const [pageCount, setPageCount] = useState(6);
  const [pokemonList, setPokemonList] = useState([]);

  const countOwned = (dataPokemonList) => {
    if (myPokemon !== 'No Data') {
      const dataPokemon = dataPokemonList.map((item) => {
        let count = 0;
        myPokemon.forEach((itemPokemon) => {
          if (item.id === parseInt(itemPokemon.pokemonId, 10)) {
            count = itemPokemon.count;
          }
        });
        return { ...item, count };
      });
      setPokemonList((prevState) => [...prevState, ...dataPokemon]);
    } else {
      setPokemonList((prevState) => [...prevState, ...dataPokemonList]);
    }
  };

  useEffect(() => {
    countOwned(data);
  }, []);

  const getDataDetailPokemon = async (dataPokemonList) => {
    const detailPokemon = await Promise.all(
      dataPokemonList.results.map(async (item) => {
        const dataPokemon = await axios.get(item.url);
        return dataPokemon.data;
      }),
    );
    return detailPokemon;
  };

  const fetchNextData = async () => {
    const newData = await axios.get(
      `${baseUrl}/pokemon?offset=${pageCount}&limit=6`,
    );
    const getDetailEachPokemon = await getDataDetailPokemon(newData.data);
    countOwned(getDetailEachPokemon);
    setPageCount((prevState) => prevState + 6);
  };

  return (
    <Layout title='Find Pokemon'>
      <InfiniteScroll
        dataLength={pokemonList.length} // This is important field to render the next data
        next={fetchNextData}
        hasMore
        loader={
          <div className='row'>
            <div className='col-12 col-md-3 d-flex justify-content-center p-2'>
              <Spinner type='grow' size='xl' />
            </div>
            <div className='col-12 col-md-3 d-flex justify-content-center p-2'>
              <Spinner type='grow' size='xl' />
            </div>
            <div className='col-12 col-md-3 d-flex justify-content-center p-2'>
              <Spinner type='grow' size='xl' />
            </div>
            <div className='col-12 col-md-3 d-flex justify-content-center p-2'>
              <Spinner type='grow' size='xl' />
            </div>
          </div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className='row pkmn-margin-footer'>
          {pokemonList.map((item) => (
            <div className='col-12 col-md-3 p-2' key={item.order}>
              <div className={`pkmn-card p-3 ${item.types[0].type.name}`}>
                <img
                  src={item.sprites.other['official-artwork'].front_default}
                  alt={item.name}
                  className='img-fluid mx-auto'
                />
                <h2 className='pkmn-card-title__name'>{item.name}</h2>
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
                    <h4 className='pkmn-card-title__owned'>
                      Owned {item.name} : {item.count}
                    </h4>
                  </div>
                  <div className='col-12 text-center'>
                    <Link href={`/pokemon/${item.id}`}>
                      {/* eslint-disable-next-line */}
                      <a className='pkmn-card-detail__link btn block '>
                        See {item.name} Detail
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </Layout>
  );
};

export default index;

const getDataAllPokemon = async () => {
  const data = await axios.get(`${baseUrl}/pokemon?offset=0&limit=8`);
  return data.data;
};

const getDataDetailPokemon = async (data) => {
  const detailPokemon = await Promise.all(
    data.results.map(async (item) => {
      const dataPokemon = await axios.get(item.url);
      return dataPokemon.data;
    }),
  );
  return detailPokemon;
};
export async function getServerSideProps() {
  const listPokemon = await getDataAllPokemon();
  const detailPokemon = await getDataDetailPokemon(listPokemon);
  const myPokemon = await axios.get(`${baseUrlMyPokemon}/count`);
  let dataPokemon = [];
  if (myPokemon !== 'No Data' && listPokemon.length > 0) {
    dataPokemon = await listPokemon.map((item) => {
      let count = 0;
      myPokemon.forEach((itemPokemon) => {
        if (item.id === parseInt(itemPokemon.pokemonId, 10)) {
          count = itemPokemon.count;
        }
      });
      return { ...item, count };
    });
  }
  return {
    props: {
      data: dataPokemon.length > 0 ? dataPokemon : detailPokemon,
      myPokemon: myPokemon.data.data,
    },
  };
}

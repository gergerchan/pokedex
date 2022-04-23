import axios from 'axios';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Progress,
  Form,
  FormGroup,
  Input,
  Spinner,
} from 'reactstrap';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrlMyPokemon = process.env.NEXT_PUBLIC_API_URLMYPOKEMON;

const pokemonDetail = ({ data }) => {
  const router = useRouter();
  const [nicknamePokemon, setNicknamePokemon] = useState(null);
  const [catchPokemon, setCatchPokemon] = useState(false);
  const [isCatch, setIsCatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const catching = 'https://thumbs.gfycat.com/DampSpanishCleanerwrasse.webp';
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleCatchPokemon = () => {
    setCatchPokemon(true);
    let catchData = 0;
    catchData = Math.floor(Math.random() * 2);
    setTimeout(() => {
      if (catchData === 0) {
        toggleModal();
        setIsCatch(false);
        setCatchPokemon(false);
      } else {
        setIsCatch(true);
        toggleModal();
      }
    }, 1500);
  };

  const handleSetNickname = (e) => {
    e.preventDefault();
    setIsExist(false);
    setNicknamePokemon(e.target.value);
  };

  const handleNickname = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const dataPokemon = await axios.post(baseUrlMyPokemon, {
      pokemonId: data.id,
      nickname: nicknamePokemon,
    });
    if (dataPokemon.data.message) {
      if (dataPokemon.data.message === 'Nickname Exist') {
        setIsExist(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.push('/my-pokemon');
      }
    }
  };

  return (
    <Layout title={`${pokemonName} Detail`}>
      <div className='row pkmn-margin-footer'>
        <div className='col-12 d-flex justify-content-center'>
          {catchPokemon ? (
            <img src={catching} alt='catch-pokemon' className='img-fluid' />
          ) : (
            <img
              src={data.sprites.other['official-artwork'].front_default}
              alt={pokemonName}
              className='img-fluid'
            />
          )}
        </div>
        <div className='col-12 d-flex justify-content-center'>
          <h2 className='pkmn-title'>{pokemonName}</h2>
        </div>
        <div className='col-12 d-flex justify-content-center'>
          {data.types.map((type) => (
            <span
              className={`pkmn-card-title__type px-4 py-2 mx-1 ${type.type.name}`}
              key={type.slot}
            >
              {type.type.name}
            </span>
          ))}
        </div>
        <div className='col-12 d-flex justify-content-center mt-3'>
          <Button
            className='pkmn-button'
            onClick={handleCatchPokemon}
            disabled={isCatch}
          >
            Catch {pokemonName}
          </Button>
        </div>
        <div className='col-12 col-md-6  mt-3 mt-md-0'>
          <h3 className='pkmn-title__status text-center'>Base Status</h3>
          {data.stats.map((item) => (
            <>
              <h5 className='pkmn-title'>{item.stat.name}</h5>
              <Progress max='300' value={item.base_stat}>
                {item.base_stat}
              </Progress>
            </>
          ))}
        </div>
        <div className='col-12 col-md-6 mt-3 mt-md-0'>
          <h3 className='pkmn-title__status text-center'>Move Set</h3>
          {data.moves.map((item) => (
            <>
              <Badge className='m-1'>{item.move.name}</Badge>
            </>
          ))}
        </div>
      </div>
      <Modal isOpen={isOpenModal}>
        <ModalHeader className='d-flex justify-content-center'>
          {isCatch
            ? `${pokemonName} Catched!`
            : `Failed to Catch ${pokemonName}`}
        </ModalHeader>
        <ModalBody>
          {isCatch ? (
            <div className='d-flex flex-column justify-content-center'>
              <div className='pkmn-image'>
                <img
                  src={data.sprites.other['official-artwork'].front_default}
                  alt={pokemonName}
                  className='img-fluid'
                />
              </div>
              <div className='pkmn-nickname d-flex justify-content-center'>
                <h3>Give your {pokemonName} a name!</h3>
              </div>
              <div className='pkmn-nickname d-flex justify-content-center'>
                <Form onSubmit={(e) => handleNickname(e)}>
                  <FormGroup>
                    <Input
                      id='pkmn-nickname'
                      name='text'
                      placeholder={`${pokemonName} nickname`}
                      type='text'
                      required
                      onChange={(e) => handleSetNickname(e)}
                    />
                  </FormGroup>
                  {isExist && (
                    <h6 className='error'>
                      Nickname {nicknamePokemon} already exist!
                    </h6>
                  )}
                  {isLoading ? (
                    <Button className='pkmn-button' block disabled>
                      <Spinner type='grow' size='sm' />
                      {'  '}Submit
                    </Button>
                  ) : (
                    <Button className='pkmn-button' block>
                      Submit
                    </Button>
                  )}
                </Form>
              </div>
            </div>
          ) : (
            <div className='d-flex flex-column justify-content-center'>
              <div className='pkmn-image'>
                <img
                  src={data.sprites.other['official-artwork'].front_default}
                  alt={pokemonName}
                  className='img-fluid'
                />
              </div>
              <div className='pkmn-nickname d-flex justify-content-center'>
                <h3>You have failed to catch {pokemonName}</h3>
              </div>
              <div className='pkmn-nickname  d-flex justify-content-center'>
                <Button className='pkmn-button' block onClick={toggleModal}>
                  Try to catch again
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </Layout>
  );
};

export default pokemonDetail;

export async function getServerSideProps(context) {
  const { params } = context;
  const data = await axios.get(`${baseUrl}/pokemon/${params.id}`);
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data: data.data },
  };
}

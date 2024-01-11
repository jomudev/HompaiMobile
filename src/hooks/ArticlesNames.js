import { useState, useEffect } from 'react';
import PantryStore from '../../modules/PantryStore';

const useArticlesNames = () => {
  const [namesList, setNamesList] = useState([]);

  useEffect(() => {
    (async function setNames () {
      setNamesList(await PantryStore.getArticlesNames());
    })()
  }, []);

  return ({
    namesList,
    setNamesList,
  });
}

export default useArticlesNames;